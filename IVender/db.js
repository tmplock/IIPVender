const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
    database: 'iip',
    username: 'iiplive',
    password: 'oLOHJkiQACPGuAgj',
    dialect: 'mysql',
    port:25060,
    timezone:'Asia/Seoul'
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(sequelize, Sequelize);
db.transactions = require('./models/transaction')(sequelize, Sequelize, 'transactions');
db.Tokens = require('./models/token')(sequelize, Sequelize);
// db.transactionSM = require('./models/transaction')(sequelize, Sequelize, 'transactionSMs');

// db.transactionWE = require('./models/transaction')(sequelize, Sequelize, 'transactionWEs');
// db.transactionEzugi = require('./models/transaction')(sequelize, Sequelize, 'transactionEzugis');
// db.transactionVivo = require('./models/transaction')(sequelize, Sequelize, 'transactionVivos');
// db.transactionPP = require('./models/transaction')(sequelize, Sequelize, 'transactionPP');
// db.transactionSpadeApi = require('./models/transaction')(sequelize, Sequelize, 'transactionSpadeApi');

module.exports = db;