
// require('dotenv').config();
// require("dotenv").config({ path: "./../.env" });

const path = require('path')

if(process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
  console.log('production mode');
} else {
  // 로컬개발시
  // require('dotenv').config({path: path.join(__dirname, '../.env')});
  // 서버개발시
  require('dotenv').config({ path: path.join(__dirname, '../.env.production') });
  console.log('development mode');
  console.log(process.env.MYSQL_PASSWORD);
}

const env = process.env;

const development = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:'+09:00',
  port:env.MYSQL_PORT,
};
 
const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:'+09:00',
  port:env.MYSQL_PORT,
};
 
const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_TEST,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  timezone:'+09:00',
  port:env.MYSQL_PORT,
};
 
module.exports = { development, production, test };