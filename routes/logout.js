const express = require('express');

const logoutRouter = express.Router();

logoutRouter
.get('/', (req, res, next) => {
    req.session.destroy((err) => { 
        if(err) {
            return next(err);
        }

        res.redirect('/');
    });
});

module.exports = logoutRouter;