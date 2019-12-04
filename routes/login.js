const express = require('express')
    , { check } = require('express-validator')
    , userController = require('../controllers/user');

const loginRouter = express.Router();

loginRouter
    .get('/', userController.loginRequired, userController.getLogin)
    .post('/', [
        check('email', 'Invalid email address').isEmail(),
        check('password', 'Invalid password').notEmpty()
    ], userController.postLogin);

module.exports = loginRouter;