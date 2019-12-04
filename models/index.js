/* eslint-disable no-undef */
const Sequelize = require('sequelize').Sequelize;
const path = require('path');
const fs = require('fs');
const config = require('../config')();

const sequelize = new Sequelize(config.db_url, {
    dialect: 'postgres',
    protocol: 'postgres',
    ssl: config.ssl
});

const db = {};
const currentFile = path.basename(__filename);

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== currentFile) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

    db.Category.hasMany(db.Product, { as: 'Products', foreignKey: 'category' });
sequelize.sync({ force: true })
    .catch((err) => console.error('[SEQUELIZE]:\n', err));

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;