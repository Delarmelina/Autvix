
const config = {
    user: 'sa',
    password: 'autvix2008',
    server: '127.0.0.1',
    database: 'users',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true
    },
    port: 1433,
}

module.exports = config;