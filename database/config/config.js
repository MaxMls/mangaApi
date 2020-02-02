require('dotenv').config();

console.log(process.env.DEV_DATABASE_URL);

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    dbname: 'uwu',
    username: 'super',
    password: 'a7c7uXgl1iObRCFE',
    dialect: 'mssql',
    host: 'uwu-owo.database.windows.net',
    dialectOptions: {

      options: {
        requestTimeout: 5000,
        encrypt: true
      }

    }
  },
};
