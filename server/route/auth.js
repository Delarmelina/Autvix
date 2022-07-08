var express = require('express');
var router = express.Router();

const dboperations = require('../db/dboperations');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';

function validateToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }
    let token = req.headers.authorization.split(' ')[0];
    if (token === 'null') {
        return res.status(401).send('Unauthorized request');
    }
    let payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
        return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    next();
}

// Rotas de Usuários

router.post('/auth/newuser', validateToken, async function (req, res,) {

    if (req.body.password !== req.body.confirmpassword) {
        return res.status(422).json({ msg: 'Password does not match' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = {
        id: 1,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    };

    const result = await dboperations.insertUser(user);
    if (result.rowsAffected[0] === 1) {
        return res.status(201).json({ msg: 'User created' });
    }
    return res.status(422).json({ msg: 'User already exists' });
});

router.post('/auth/deleteuser', validateToken, async function (req, res,) {
    const result = await dboperations.deleteUser(req.body.id);
    if (result.rowsAffected[0] === 1) {
        return res.status(201).json({ msg: 'User deleted' });
    }
    return res.status(422).json({ msg: 'User does not exist' });
});

router.post('/auth/updateuser', validateToken, async function (req, res,) {
    const user = {
        idn: req.body.idn,
        ido: req.body.ido,
        name: req.body.name,
        email: req.body.email,
    };

    const result = await dboperations.updateUser(user);
    if (result.rowsAffected[0] === 1) {
        return res.status(201).json({ msg: 'User updated' });
    }
    return res.status(422).json({ msg: 'User does not exist' });
});

router.get('/users', validateToken, async function (req, res) {

    const users = await dboperations.getUsers();
    return res.status(200).json(users);
});

router.get('/auth/login', async function (req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    const result = await dboperations.getUsers("email" ,user.email);
    if (result.length === 0) {
        return res.status(422).json({ msg: 'User does not exist' });
    }

    const isValid = await bcrypt.compare(user.password, result[0].password);
    if (!isValid) {
        return res.status(422).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign({ id: result[0].id }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
});

router.get('/auth/validate', validateToken, function (req, res) {
    return res.status(200).json({ msg: 'Token is valid' });
});

module.exports = router;