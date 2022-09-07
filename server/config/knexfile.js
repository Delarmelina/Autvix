// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'mssql',
  connection: {
    database: 'Autvix',
    user: 'sa',
    password: 'autvix2008',
    host: '127.0.0.1',
    port: 1433,
    options: {
      trustedConnection: true,
      enableArithAbort: true,
      trustServerCertificate: true,
      encrypt: false
    }
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
