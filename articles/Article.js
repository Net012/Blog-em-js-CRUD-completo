const Sequelize = require("sequelize");

const connection = require("../database/database");

const Category = require("../categories/Category");

const Article = connection.define("article",{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    body:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Relacionamentos BD
Category.hasMany(Article);

Article.belongsTo(Category);

module.exports = Article;