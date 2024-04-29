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

const redis = require('./redis');

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
// app.use('/vivo', require('./routes/vivo').router);
// app.use('/pp', require('./routes/pp').router);
// app.use('/we', require('./routes/worldent').router);
 app.use('/ezugi', require('./routes/ezugi').router);
// app.use('/spadeapi', require('./routes/spadeapi'));
// app.use('/habanero', require('./routes/habanero').router);
app.use('/honorlink', require('./routes/honorlink').router);
app.use('/cq9', require('./routes/cq9').router);


app.get('/', (req, res) => {

    console.log(`IVender Default Router`);

    res.send('Welcome Honorlink Vender');
});

app.get('/test', async (req, res) => {

    console.log(`/test`);
    console.log(req.query);

    const object = {strID:req.query.strID, iValue:req.query.iValue};

    await redis.SetCache(req.query.strID, object);

    const data = await redis.GetCache(req.query.strID);

    console.log(data);

    console.log(JSON.parse(data));


    res.send('Welcome to Test');
});

app.get('/testvalue', async (req, res) => {

    console.log(`/testvalue`);
    console.log(req.query);

    // const object = {strID:req.query.strKey, iValue:req.query.iValue};

    // redis.SetCache(req.query.strKey, object);

    const data = await redis.GetCache(req.query.strID);

    console.log(data);


    res.send('Welcome to Test');
})


const cPort = 3001;
server.listen(cPort, () => {
    console.log(`IVender Server is started At ${cPort}`);
});

setInterval(async () => {
}, 1000);


// let date = new Date();
// console.log(moment(date).format('YYYY-MM-DD'));

// let date = new Date();
// console.log(moment(date).format('YYYYMMDD'));

// let icash = 10000;
// console.log(icash.toFixed(2));