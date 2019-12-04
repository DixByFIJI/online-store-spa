const express = require('express');
const admin = require('./admin');
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const products = require('./products');
const m = require('../models');

const root = express.Router();
root.get('/', (req, res) => {
    await m.User.create({ login: 'admin1', password: 'qwe123', role: 'admin' });
    await m.Category.create({ name: 'laptops'});
    await m.Category.create({ name: 'desktops'});
    await m.Category.create({ name: 'mobiles'});
    return res.redirect('/products');
});

module.exports = {
    root, admin, register, login, logout, products
}