const express = require('express')
    , { check } = require('express-validator')
    , userController = require('../controllers/user');

const registerRouter = express.Router();

registerRouter
    .get('/', userController.loginRequired, userController.getRegister)
    .post('/', [
        check('email', 'Invalid email address').isEmail(),
        check('password', 'Password must at least consist of 6 characters').isLength({min: 6}),
        check('password-confirm').custom((value, { req }) => value === req.body.password).withMessage('Passwords don\'t match')
    ], userController.postRegister);

module.exports = registerRouter;