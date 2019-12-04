const express = require('express')
    , { check } = require('express-validator')
    , userController = require('../controllers/user');

const adminRouter = express.Router();

adminRouter
    .get('/', userController.loginRequired, userController.getAdmin)
    .post('/', [
        check('login', 'Invalid login').notEmpty(),
        check('password', 'Invalid password').notEmpty()
    ], userController.postAdmin);

module.exports = adminRouter;