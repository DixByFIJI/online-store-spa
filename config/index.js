/* eslint-disable no-undef */
const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '.env')});

const config = {
    env: {
        mode: 'env',
        port: process.env.PORT,
        db_host: process.env.DATABASE_HOST,
        db_port: process.env.DATABASE_PORT,
        db_name: process.env.DATABASE_NAME,
        db_user: process.env.DATABASE_USER,
        db_pass: process.env.DATABASE_PASSWORD,
        session_name: process.env.SESSION_NAME,
        session_lifetime: process.env.SESSION_LIFETIME,
        session_secret: process.env.SESSION_SECRET
    }
}

module.exports = function(mode) {
    if(result.error) console.error('An error\'s occured while loading .env configuration file', result.error);
    return config[mode || process.argv[2] || 'env'] || config.env;
}