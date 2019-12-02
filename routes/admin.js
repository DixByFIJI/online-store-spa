const express = require('express')
    , { check, validationResult } = require('express-validator')
    , models = require('../models');

const adminRouter = express.Router();

adminRouter
.get('/', (req, res, next) => {
    const admin_id = req.session.admin_id;
    if(!admin_id) {
        return res.render('pages/layout', {
            title: 'Admin',
            target: 'admin'
        });
    }
    res.redirect('/');
})
.post('/', [
    check('login', 'Invalid login').notEmpty(),
    check('password', 'Invalid password').notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('pages/layout', {
            title: 'Admin',
            target: 'admin',
            errors: errors.mapped()
        });
    }

    const { login, password } = req.body;
    try {
        const admin = await models.Admin.findOne({
            where: {
                login: login
            }
        });

        if(!admin) {
            return res.render('pages/layout', { 
                title: 'Admin',
                target: 'admin',
                errors: { login: { msg: 'Admin by specified login doesn\'t exist' } }
            });
        }

        const result = password === admin.get('password');
        if(!result) {
            return res.render('pages/layout', { 
                title: 'Admin',
                target: 'admin',
                errors: { password: { msg: 'Wrong password' } }
            });
        }

        req.session.admin_id = admin.get('admin_id');
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
});

module.exports = adminRouter;