const localStrategy = require('passport-local').Strategy;

const {user} = require('../models');

module.exports = (passport) => {
    passport.use(new localStrategy({
        usernameField: 'email_id',
        passwordField: 'password'
    }, async(email_id, password, done) => {
        try{
            const exUser = await user.findOne({where: {email_id}});
            if(exUser) {
                const result = exUser.password == password; // 수정!! password == user.password
                if(result) {
                    done(null, exUser);
                } else {
                    done(null, false, {message: '비밀번호가 일치하지 않습니다'});
                }
            } else {
                done(null, false, {message: '가입한 적이 없습니다'})
            }
        } catch(error) {
            console.error(error);
            done(error);
        }
    }))
};