/* eslint-disable no-undef */

const config = {
    dev: {
        mode: 'dev',
        port: process.env.PORT,
        db_host: process.env.DATABASE_HOST,
        db_port: process.env.DATABASE_PORT,
        db_name: process.env.DATABASE_NAME,
        db_user: process.env.DATABASE_USER,
        db_pass: process.env.DATABASE_PASSWORD,
        db_dialect: process.env.DATABASE_DIALECT,
        mongodb_url: process.env.MONGODB_URL,
        session_name: process.env.SESSION_NAME,
        session_lifetime: process.env.SESSION_LIFETIME_H,
        session_secret: process.env.SESSION_SECRET
    },

    prod: {
        mode: 'prod',
        port: process.env.PORT,
        db_url: process.env.DATABASE_URL,
        db_dialect: process.env.DATABASE_DIALECT,
        db_protocol: process.env.DATABASE_PROTOCOL,
        mongodb_url: process.env.MONGODB_URL,
        session_name: process.env.SESSION_NAME,
        session_lifetime: process.env.SESSION_LIFETIME_H,
        session_secret: process.env.SESSION_SECRET
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'dev'] || config.dev;
}