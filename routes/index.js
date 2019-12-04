const express = require('express');
const admin = require('./admin');
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const products = require('./products');

const root = express.Router();
root
    .use('/', (req, res) => {
        return res.redirect('/products');
    })
    .use('/admin', admin)
    .use('/products', products)
    .use('/register', register)
    .use('/login', login)
    .use('/logout', logout)
    .use('*', (req, res) => {
        res.render('pages/error');
    });

module.exports = root;