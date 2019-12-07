const { validationResult } = require('express-validator')
    , bcrypt = require('bcryptjs')
    , config = require('../config')
    , models = require('../models');

exports.postRegister = async (req, res, next) => {
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
        const [ created ] = await models.User.findOrCreate({
            where: { login: email },
            defaults: { password: hash, role: 'user'}
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
}

exports.getRegister = async (req, res) => {
    if(req.user) {
        return res.redirect('/');
    }
    res.render('pages/layout', {
        title: 'Sign-Up',
        target: 'register'
    });
}

exports.getLogin = async (req, res) => {
    if(!req.user) {
        return res.render('pages/layout', {
            title: 'Sign-In',
            target: 'login'
        });
    }
    res.redirect('/');
}

exports.postLogin = async (req, res, next) => {
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
                login: email
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
}

exports.getLogout = async (req, res, next) => {
    req.session.destroy((err) => { 
        if(err) {
            return next(err);
        }
        res.clearCookie(config.session_name);
        res.redirect('/');
    });
}

exports.getAdmin = async (req, res) => {
    if(!req.user || req.user && !req.user.isAdmin) {
        return res.render('pages/layout', {
            title: 'Admin',
            target: 'admin'
        });
    }
    console.log('asd');
    res.redirect('/');
}

exports.postAdmin = async (req, res, next) => {
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
        const admin = await models.User.findOne({
            where: {
                login: login,
                role: 'admin'
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

        req.session.user_id = admin.get('user_id');
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
}

exports.loginRequired = async (req, res, next) => {
    const user_id = req.session.user_id;
    if(!user_id) {
        return next();
    }

    try {
        const user = await models.User.findOne({
            where: {
                user_id: user_id,
            }
        });
        
        if(!user) {
            return next();
        }

        req.user = {
            login: user.get('login'),
            isAdmin: user.get('role') === 'admin'
        }

        return next();
    } catch (err) {
        next(err);
    }
}