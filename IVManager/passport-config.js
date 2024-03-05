const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// var seq = require('./db');
//var db = require('./models');
//var User = require('../models/user')(seq.sequelize, seq.Sequelize);
// var User = seq.Users;

const db = require('./db');

module.exports = () => {

    console.log('passport is passed');

    function SessionConstructor(userID, userGroup, details)
    {
        this.userID = userID;
        this.userGroup = userGroup;
        this.details = details;        
    }

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (user_id, done) => {

        const user = await db.Users.findOne({ where: { id: user_id } });
        done(null, user);
    });


    passport.use('local', new LocalStrategy(
        {
            usernameField: 'strNickname',
            passwordField: 'strPassword',
            session: true,
            passReqToCallback: true,
        },
        async function (req, username, password, done) {

            try {
                var user = await db.Users.findOne({ where: { strID: username } });

                if ( user == undefined ) {
                    console.log(`Invalid User`);
                    return done(null, false, { message: '없는 사용자 아이디 입니다.' });
                }

                if (user.strPassword != password) {
                    console.timeLog(`Invalid Password`);
                    return done(null, false, { message: '비밀번호가 틀렸습니다.' });
                }


                //console.log(`Parameter : ${username}, ${password}, DB User : ${user.strNickname}`);

                // await db.Users.update({loginedAt : db.sequelize.literal('CURRENT_TIMESTAMP')}, { where: { strID: username } });

                return done(null, user);
            } 
            catch ( e ) 
            {
                console.log(e);
                return done(e);
            }
        }
    ));
}

