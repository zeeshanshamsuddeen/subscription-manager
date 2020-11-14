require('../initiateEnv');
const mysql = require('mysql2/promise');
const config = require('../config');

const { DATABASE } = config.appDefaults;
const {
  NAME, USERNAME, PASSWORD,
} = DATABASE;

(() => {
  try {
    mysql.createConnection({
      user: USERNAME,
      password: PASSWORD,
    })
      .then((connection) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${NAME};`).then(() => {
          console.log('Database created');
          process.exit();
        });
      });
  } catch (error) {
    console.log('error: ', error);
  }
})();
