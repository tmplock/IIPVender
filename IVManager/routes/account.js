const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended:false}));

const path = require('path');
router.use(express.static(path.join(__dirname, '../', 'public')));

// const db = require('../models');
const db = require('../db');
const time = require('../utils/time');

const {Op}= require('sequelize');

router.get('/login', async(req, res) => {
    res.render('account/login', {iLayout:1, messages:req.flash('error')[0]});
});

router.post('/login', passport.authenticate('local', {
    //successRedirect: '/manage_partner/betting_realtime',
    // successRedirect: '/manage_partner/default',
    successRedirect:'/',
    failureRedirect:'/account/login',
    failureFlash: true
}), (req, res) => {

    console.log(`post : /account/login : req.session.messages}`);
});

// router.post('/login_viceadmin', passport.authenticate('local_viceadmin', {
//     successRedirect: '/manage_partner/betting_realtime',    
//     failureRedirect: '/account/login',
//     failureFlash: true
// }), (req, res) => {

//     console.log(req.body);

//     console.log(`post : /account/login : req.session.messages}`);
// });

router.get('/logout', (req, res) => {

    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        // if you're using express-flash
        req.flash('success_msg', 'session terminated');
        res.redirect('/account/login');
      });

})

module.exports = router;