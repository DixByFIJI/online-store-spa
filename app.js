const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , MongoStore = require('connect-mongo')(session)
    , config = require('./config')()
    , routes = require('./routes');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({
    store: new MongoStore({
        url: config.mongodb_url,
        secret: config.session_secret
    }),
    cookie: {
        httpOnly: true,
        maxAge: (config.session_lifetime || 2) * 1000 * 60 * 60 * 2
    },
    resave: false,
    saveUninitialized: false,
    secret: config.session_secret || 'lasiy32rhwe0LYGDluyql12312u',
    name: config.session_name || 'sid'
}));

app.use('/', routes.root);
app.use('/admin', routes.admin);
app.use('/products', routes.products)
app.use('/register', routes.register);
app.use('/login', routes.login);
app.use('/logout', routes.logout);

app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(err.status === 404) {
        return res.render('pages/error_nf');
    }

    console.error(err);
    res.redirect('/');
});

app.listen(config.port, _ => {
    console.log(`Express server's started on port: ${config.port}...`);
});

module.exports = app;