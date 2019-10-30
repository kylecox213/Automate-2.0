const path = require("path");

module.exports = {
    "development": {
        "username": process.env.MYSQL_USER,
        "password": process.env.MYSQL_KEY,
        "database": process.env.MYSQL_DBNAME,
        "host": process.env.MYSQL_HOST,
        "dialect": "mysql"
        // Properties to re-enable for production, to use SQLite DB
        // "dialect": "sqlite",
        // "storage": path.join(__dirname, "../db/automate.db")
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "testDB",
        "host": "localhost",
        "dialect": "sqlite",
        "logging": false
    },
    "production": {
        "use_env_variable": "JAWSDB_URL",
        "dialect": "mysql"
        // "dialect": "sqlite"
    }
}