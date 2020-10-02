/* eslint-disable arrow-body-style */
const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const connectDB = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      connection.getConnection((err) => {
        if (err) reject(err);
        resolve(console.log('Database for Test Connected!'));
      });
    } else {
      connection.getConnection((err) => {
        if (err) reject(err);
        resolve(console.log('Database Connected!'));
      });
    }
  });
};
const disconnectDB = () => {
  return new Promise((resolve, reject) => {
    connection.end((err) => {
      if (err) reject(err);
      resolve(console.log('Database Successfully Disconnected!'));
    });
  });
};
module.exports = { connection, connectDB, disconnectDB };
