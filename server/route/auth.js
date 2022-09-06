// Bibliotecas do Express para funcionamento da rota
var express = require('express');
var router = express.Router();

// Responsaveis pelo Funcionamento do Banco de Dados
const sql = require('mssql');
var config = require('../config/dbconfig.js');

// Bibliotecas responsaveis pelas gerações e manipulações do password
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';

// Função para realizar a verificação do token de autenticação do front end
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

// Função de criação do novo usuario
router.post('/newuser', async function (req, res,) {

    // Gerar a senha encriptografada para adicionar no banco de dados
    if (req.body.password !== req.body.confirmpassword || !req.body.password) {
        return res.status(422).json({ msg: 'Password does not match or is blank !' });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Ajuste do objeto user
    const user = req.body;
    user.password = hashedPassword;
    delete user.confirmpassword;

    try {
        let pool = await sql.connect(config);

        // Texto do cmd SQL para atribuição de novo usuario
        let text = "if (select COUNT(*) from Usuarios where matricula = " + user.matricula + ") < 1"
            + "insert into Usuarios values ("
            + user.matricula + ", '"
            + user.name + "', '"
            + user.endereco + "', '"
            + user.id_dep + "', '"
            + user.email + "', '"
            + user.abrev + "', '"
            + user.born + "', '"
            + user.contratacao + "', '"
            + user.password + "', "
            + user.id_funcao + ")"

        // Escrita do novo usuario no banco de dados
        let result = await pool.request().query(text);
        console.log(result.rowsAffected);

        // Resposta da query SQL criada
        if (result.rowsAffected == 0) {
            res.status(400).json("Users not created !")
        }
        else {
            res.status(200).json("User created sucessfully !")
        }

    } catch (err) { }

});

// Função para realização do login e geração do token de autenticação
router.post('/login', async function (req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        // Busca os dados do usuario no banco de dados
        let pool = await sql.connect(config);
        let text = "select matricula, email, password from Usuarios where email = '" + user.email + "'";
        let result = await pool.request().query(text);

        // Verifica se o usuario foi encontrado no banco de dados e caso encontrado, 
        // Compara a senha criptografada do banco com a senha digitada pelo usuario
        if (result.rowsAffected < 1) {
            res.status(400).json("Users not Exist !")
        }
        else {
            let validatePassword = await bcrypt.compare(user.password, result.recordset[0].password)

            // Se a senha estiver valida e correta, gera um token temporario de autenticação para o usuario
            if (validatePassword) {
                // Geração do token de autenticação
                const token = jwt.sign(
                    { id: result.recordset[0].matricula },
                    JWT_SECRET, { expiresIn: "5m", }
                );
                res.status(200).json({ token }) // Retorna o token de autenticação para o front end
            }
            else {
                res.status(401).json("Password incorrect !")
            }
        }
    } catch (err) { res.status(400).json("Erro na autenticação : " + err.message) };
});

// Função que faz o teste de validação do token de usuario para verificar se está logado
router.post('/validate', validateToken ,async function (req, res) {

    const token = req.headers.authorization;    // Obtem o token do header do front end

    // Se não tiver token, já retorna falha de autorização
    if (token == "") {
        return res.status(401).json({ msg: 'Unauthorized request' })
    } else {
        try {
            // Caso encontrado o token, decodifica o mesmo, encontrando o id do usuario responsável pelo token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Busca no banco de dados, as informações referentes ao usuario
            let pool = await sql.connect(config);
            let text = "select matricula, nome, email from Usuarios where matricula = " + decoded.id;
            let result = await pool.request().query(text);

            // If Usuario encontrado, então o token é valido e retorna "encontrado"
            if (result.recordset.length > 0) {
                return res.status(200).json({ msg: "User found: " + result.recordset[0].nome })
            } else {
                return res.status(400).json({ msg: "User not found" })
            }
        }
        catch (err) {
            return res.status(401).json({
                msg: "Authrization expired !"
            })
        }
    }
});

module.exports = router;