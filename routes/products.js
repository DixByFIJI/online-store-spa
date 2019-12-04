const express = require('express')
    , { check } = require('express-validator')
    , userController = require('../controllers/user')
    , productController = require('../controllers/product')

const productsRouter = express.Router();

productsRouter
<<<<<<< HEAD
.get('/', adminRequired, userRequired, async (req, res, next) => {
    const order = req.query.order;
    const filter = req.query.filter;

    try {
        const categories = await models.Category.findAll({ raw: true });
        const category = await models.Category.findOne({ where: { name: filter || null } });
        const products = filter === 'all' || !category ?
            await models.Product.findAll({
                raw: true, 
                limit: 20,
                order: [
                    order === 'cheap' ? ['price', 'ASC'] :
                    order === 'expensive' ? ['price', 'DESC'] :
                    order === 'early' ? ['createdAt', 'ASC'] : 
                    ['createdAt', 'DESC']
                ]
            }) :
            await category.getProducts({
                raw: true, 
                limit: 20,
                order: [
                    order === 'cheap' ? ['price', 'ASC'] :
                    order === 'expensive' ? ['price', 'DESC'] :
                    order === 'early' ? ['createdAt', 'ASC'] : 
                    ['createdAt', 'DESC']
                ]
            });
        return res.render('pages/layout', {
            title: 'Home',
            target: 'products',
            categories: categories,
            products: products,
            admin: req.admin,
            user: req.user
        });
    } catch (err) {
        next(err);
    }
});
productsRouter.get('/add', adminRequired, async (req, res, next) => {
    if(!req.admin) {
        return res.redirect('/');
    }

    try {
        const categories = await models.Category.findAll({ raw: true });
        return res.render('pages/layout', {
            title: 'Add product',
            target: 'add_product',
            admin: req.admin,
            categories: categories
        });
    } catch (err) {
        next(err);
    }
});
productsRouter.post('/add', [
    check('name', 'Invalid name').notEmpty(),
    check('image', 'Invalid image url').notEmpty(),
    check('category', 'Invalid category').notEmpty(),
    check('description', 'Invalid description').notEmpty(),
    check('description', 'Too long description').isLength({max: 2048}),
    check('price', 'Invalid price').notEmpty()
], adminRequired, async (req, res, next) => {
    if(!req.admin) {
        return res.redirect('/');
    }
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        try {
            const categories = await models.Category.findAll({ raw: true });
            if(categories) {
                return res.render('pages/layout', {
                    title: 'Add product',
                    target: 'add_product',
                    categories: categories,
                    admin: req.admin,
                    errors: errors.mapped()
                });
            }
        } catch (err) {
            next(err);
        }
    }

    const product = { name, image, category, description, price } = req.body;
    try {
        await models.Product.create(product);
        res.redirect('/');
    } catch (err) {
        return res.redirect('/products/add');
    }
});
productsRouter.get('/remove/:id', adminRequired, async (req, res, next) => {
    if(!req.admin) {
        return res.redirect('/');
    }
    const id = req.params.id;
    try {
        await models.Product.destroy({
            where: {
                product_id: id
            }
        });
        res.redirect('/');
    } catch (err) {
        res.next(err);
    }
});
productsRouter.get('/get/:id', userRequired, adminRequired, async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await models.Product.findOne({
            where: {
                product_id: id
            }
        });

        if(!product) {
            return res.render('pages/error');
        }

        res.render('pages/layout', {
            title: product.name,
            target: 'product',
            product: product,
            admin: req.admin,
            user: req.user
        });
    } catch (err) {
        res.render('pages/error');
    }
});
=======
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
>>>>>>> dev

module.exports = productsRouter;