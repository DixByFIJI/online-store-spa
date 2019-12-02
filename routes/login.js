const express = require('express')
    , { check, validationResult } = require('express-validator')
    , bcrypt = require('bcryptjs')
    , models = require('../models');

const loginRouter = express.Router();

loginRouter
.get('/', (req, res, next) => {
    const user_id = req.session.user_id;
    if(!user_id) {
        return res.render('pages/layout', {
            title: 'Sign-In',
            target: 'login'
        });
    }
    res.redirect('/');
})
.post('/', [
    check('email', 'Invalid email address').isEmail(),
    check('password', 'Invalid password').notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('pages/layout', {
            title: 'Sign-In',
            target: 'login',
            errors: errors.mapped()
        });
    }

    const { email, password } = req.body;
    try {
        const user = await models.User.findOne({
            where: {
                email: email
            }
        });
        if(!user) {
            return res.render('pages/layout', { 
                title: 'Sign-In',
                target: 'login',
                errors: { email: { msg: 'Account by specified email doesn\'t exist' } }
            });
        }

        const result = await bcrypt.compare(password, user.get('password'));
        if(!result) {
            return res.render('pages/layout', { 
                title: 'Sign-In',
                target: 'login',
                errors: { password: { msg: 'Wrong password' } }
            });
        }

        req.session.user_id = user.get('user_id');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

module.exports = loginRouter;