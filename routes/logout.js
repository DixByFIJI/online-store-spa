const express = require('express')
    , userController = require('../controllers/user');

const logoutRouter = express.Router();

logoutRouter.get('/', userController.getLogout);

module.exports = logoutRouter;