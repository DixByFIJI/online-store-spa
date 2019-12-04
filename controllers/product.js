const { validationResult } = require('express-validator')
    , models = require('../models')

exports.getProducts = async (req, res, next) => {
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
            user: req.user
        });
    } catch (err) {
        next(err);
    }
}

exports.getProduct = async (req, res) => {
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
            user: req.user
        });
    } catch (err) {
        res.render('pages/error');
    }
}

exports.getProductAdd = async (req, res, next) => {
    if(!req.user || req.user && !req.user.isAdmin) {
        return res.redirect('/');
    }

    try {
        const categories = await models.Category.findAll({ raw: true });
        return res.render('pages/layout', {
            title: 'Add product',
            target: 'add_product',
            user: req.user,
            categories: categories
        });
    } catch (err) {
        next(err);
    }
}

exports.postProductAdd = async (req, res, next) => {
    if(!req.user || req.user && !req.user.isAdmin) {
        return res.redirect('/');
    }
    
    const errors = validationResult(req);
    console.log(errors.isEmpty);
    if(!errors.isEmpty()) {
        try {
            const categories = await models.Category.findAll({ raw: true });
            if(categories) {
                return res.render('pages/layout', {
                    title: 'Add product',
                    target: 'add_product',
                    categories: categories,
                    user: req.user,
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
}

exports.getProductRemove = async (req, res, next) => {
    if(!req.user || req.user && !req.user.isAdmin) {
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
}