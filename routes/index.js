const express = require('express');
const admin = require('./admin');
const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const products = require('./products');
const m = require('../models');

const root = express.Router();
root.get('/', async (req, res) => {
    return res.redirect('/products');
});

module.exports = {
    root, admin, register, login, logout, products
}