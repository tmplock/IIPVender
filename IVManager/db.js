const Sequelize = require('sequelize');
//const sequelize = new Sequelize('iiplive', 'sss', '11111', {host:'103.60.126.54', dialect:'mysql'});
//const sequelize = new Sequelize('iiplive', 'sss', 'Supersong37#', {host:'192.168.0.2', dialect:'mysql'});

//const sequelize = new Sequelize('iiplive', 'sss', '1111', {host:'103.60.124.87', dialect:'mysql'});

const sequelize = new Sequelize({
    host: 'db-mysql-sgp1-27012-do-user-11246819-0.b.db.ondigitalocean.com',
    database: 'iip',
    username: 'doadmin',
    password: '8qGHgv3sI6qfmVO1',
    dialect: 'mysql',
    port:25060,
    timezone:'+09:00',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require('./models/user')(sequelize, Sequelize);
db.transactions = require('./models/transaction')(sequelize, Sequelize, 'transactions');
db.Tokens = require('./models/token')(sequelize, Sequelize);
db.Inouts = require('./models/inout')(sequelize, Sequelize);

module.exports = db;