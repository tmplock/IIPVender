'use strict'

const express = require('express');
const app = express();
const server = require('http').Server(app);
const layout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
const passport = require('passport');
const flash = require('connect-flash');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(layout);
app.set('layout', 'common/layout');
app.set('layout extractScripts', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const {Op}= require('sequelize');

const db = require('./db');
db.sequelize.sync();

const passportconfig = require('./passport-config');

app.use(session({
    secret: 'administrator#',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: (4 * 60 * 60 * 1000) },
    passport: {}
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportconfig();

var i18na = require('./i18n');
app.use(i18na);


app.use('/account', require('./routes/account'));
app.use('/partner', require('./routes/partner'));
app.use('/partner_popup', require('./routes/partner_popup'));
app.use('/inout_popup', require('./routes/inout_popup'));

// app.use((req, res, next) => {
//     req.io = io;
//     return next();
// });

app.get('/ko', async (req, res) => {
    res.cookie('lang', 'ko');
    res.redirect('/');
})

app.get('/jp', async (req, res) => {
    res.cookie('lang', 'jp');
    res.redirect('/');
})

app.get('/en', async (req, res) => {
    res.cookie('lang', 'en');
    res.redirect('/');
})

app.get('/', (req, res) => {
    if ( req.user != null )
    {
        //res.render('index', {iLayout:0, user:req.user, iHeaderFocus:0});
        res.redirect('/partner/list');
    }
    else
        res.redirect('/account/login');
});



app.post('/request_init', async (req, res) => {

    await db.Tokens.destroy({where:{}, truncate:true});
    await db.Inouts.destroy({where:{}, truncate:true});
    await db.transactions.destroy({where:{}, truncate:true});
    let users = await db.Users.findAll();
    for ( let i in users )
    {
        await users[i].update({
            iRolling:0,
            iSettle:0,
            iLoan:0,
            iCash:0,
            iSettleAcc:0,
        });
    }
    
    res.send({result:'OK'});
});

app.post('/request_removetransactions', async (req, res) => {

    console.log(`/request_removetransactions`);
    console.log(req.body);

    await db.transactions.destroy({where:{createdAt:{[Op.lte]:req.body.strDate}}});

    res.send({result:'OK'});
});

const cPort = 3000;
server.listen(cPort, () => {
    console.log(`IIP CMS Server Started At ${cPort}`);
});

setInterval(async () => {

}, 1000);
