const Sequelize = require('sequelize');

//  Production
const sequelize = new Sequelize({
    host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
    database: 'iip',
    username: 'iiplive',
    password: 'oLOHJkiQACPGuAgj',
    dialect: 'mysql',
    port:25060,
    timezone:'Asia/Seoul'
});

// //  Staging
// const sequelize = new Sequelize({
//     host: 'db-mysql-sgp1-62759-do-user-11246819-0.c.db.ondigitalocean.com',
//     database: 'iip',
//     username: 'doadmin',
//     password: 'AVNS_CHqkvP_p_JM6uWuOb73',
//     dialect: 'mysql',
//     port:25060,
//     timezone:"+09:00"
// });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(sequelize, Sequelize);
db.transactions = require('./models/transaction')(sequelize, Sequelize, 'transactions');
db.Tokens = require('./models/token')(sequelize, Sequelize);

module.exports = db;