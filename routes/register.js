const express = require('express')
    , { check, validationResult } = require('express-validator')
    , bcrypt = require('bcryptjs')
    , models = require('../models');

const registerRouter = express.Router();

registerRouter
.get('/', (req, res, next) => {
    if(req.session.user_id) {
       return res.redirect('/');
    }
    res.render('pages/layout', {
        title: 'Sign-Up',
        target: 'register'
    });
})
.post('/', [
    check('email', 'Invalid email address').isEmail(),
    check('password', 'Password must at least consist of 6 characters').isLength({min: 6}),
    check('password-confirm').custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match')
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('pages/layout', {
            title: 'Sign-Up',
            target: 'register',
            errors: errors.mapped()
        });
    }

    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, 14);

    try {
        const [user, created] = await models.User.findOrCreate({
            where: { email: email },
            defaults: { password: hash}
        });
    
        if(!created) {
            return res.render('pages/layout', {
                title: 'Sign-Up',
                target: 'register',
                errors: { email: { msg: 'Specified email\'s been already registered' } }
            });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        next(err);
    }
});

module.exports = registerRouter;