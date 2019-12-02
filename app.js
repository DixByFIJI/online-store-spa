const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , errorHandler = require('errorhandler')()
    , config = require('./config')()
    , routes = require('./routes');

const app = express();
app.set('port', config.port);
app.set('env', config.mode);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'paduihwpirbandmoahwypaw',
    resave: false,
    saveUninitialized: false
}));

app.use('/', routes.root);
app.use('/admin', routes.admin);
app.use('/products', routes.products)
app.use('/register', routes.register);
app.use('/login', routes.login);
app.use('/logout', routes.logout);
app.use('*', (req, res, next) => {
    res.render('pages/error');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.redirect('/');
});

app.listen(app.get('port'), _ => {
    console.log(`Express server's started on port: ${app.get('port')}...`);
});