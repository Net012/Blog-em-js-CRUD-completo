const Sequelize = require("sequelize");

const connection = new Sequelize("guiapress", "root", "842659731", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
});

module.exports = connection;