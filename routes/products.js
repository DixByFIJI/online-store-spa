const express = require('express')
    , { check } = require('express-validator')
    , userController = require('../controllers/user')
    , productController = require('../controllers/product')

const productsRouter = express.Router();

productsRouter
    .get('/', userController.loginRequired, productController.getProducts)
    .get('/add', userController.loginRequired, productController.getProductAdd)
    .post('/add', [
        check('name', 'Invalid name').notEmpty(),
        check('image', 'Invalid image url').notEmpty(),
        check('category', 'Invalid category').notEmpty(),
        check('description', 'Invalid description').notEmpty(),
        check('description', 'Too long description').isLength({max: 2048}),
        check('price', 'Invalid price').notEmpty()
    ], userController.loginRequired, productController.postProductAdd)
    .get('/remove/:id', userController.loginRequired, productController.getProductRemove)
    .get('/:id', userController.loginRequired, productController.getProduct);

module.exports = productsRouter;