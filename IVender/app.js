'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');

const moment = require('moment');

const corsOption = {
    origin: 'https://playint.tableslive.com',
    optionsSuccessStatus: 200
};

app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = require('./db');
db.sequelize.sync();

// db.Users.create(
//     {
//         strID:'unover',
//         strPassword:'123123',
//         strAgentCode:'',
//         strSecretCode:'',
//         strCallbackURL:'',
//         iClass:1,
//         strGroupID:'001',
//         iParentID:null,
//         iCash:0,
//         iPoint:0,
//         iLoan:0,
//         fOdds:0,
//         eState:'NORMAL',
//     }
// );

app.use('/game', require('./routes/game'));
app.use('/vivo', require('./routes/vivo').router);
app.use('/pp', require('./routes/pp').router);
app.use('/we', require('./routes/worldent').router);
app.use('/ezugi', require('./routes/ezugi').router);
app.use('/spadeapi', require('./routes/spadeapi'));
app.use('/habanero', require('./routes/habanero').router);
app.use('/honorlink', require('./routes/honorlink').router);
app.use('/cq9', require('./routes/cq9').router);


app.get('/', (req, res) => {

    res.send('Welcome');
})

const cPort = 3001;
server.listen(cPort, () => {
    console.log(`IIPGame Server is started At ${cPort}`);
});

setInterval(async () => {
}, 1000);


// let date = new Date();
// console.log(moment(date).format('YYYY-MM-DD'));

// let date = new Date();
// console.log(moment(date).format('YYYYMMDD'));

// let icash = 10000;
// console.log(icash.toFixed(2));