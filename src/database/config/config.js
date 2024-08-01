require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: 'Hiakus1971',
    database: 'library',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
