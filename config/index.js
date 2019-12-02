const config = {
    prod: {
        mode: 'prod',
        port: process.env.PORT,
        db_url: process.env.DATABASE_URL,
        ssl: true
    }
}

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'prod'] || config.prod;
}