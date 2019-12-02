const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '.env')});

const config = {
    local: {
        mode: 'local',
        port: 49150,
        db_host: 'localhost',
        db_port: 49140,
        db_name: 'online-shop',
        db_user: 'postgres',
        db_pass: 'QWE123'
        
    },
    environment: {
        mode: 'env',
        port: process.env.PORT,
        db_host: process.env.DATABASE_HOST,
        db_port: process.env.DATABASE_PORT,
        db_name: process.env.DATABASE_NAME,
        db_user: process.env.DATABASE_USER,
        db_pass: process.env.DATABASE_PASSWORD,
    }
}

module.exports = function(mode) {
    if(result.error) console.error('An error\'s occured while loading .env configuration file', result.error);
    return config[mode || process.argv[2] || 'local'] || config.local;
}