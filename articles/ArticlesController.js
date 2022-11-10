const express = require("express");

const router = express.Router();

const Category = require("../categories/Category");

const Article = require("./Article");

const slugify = require("slugify");

//rotas GET
router.get("/admin/articles", (req, res) => {

    Article.findAll({
        include: [
            { model: Category }
        ]
    })
        .then(articles => {
            res.render("admin/articles/index", { articles: articles });
        });
});

router.get("/admin/articles/new", (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories });
    });
});

//rotas POST
router.post("/articles/save", (req, res) => {
    const article = {
        title: req.body.title,
        body: req.body.body,
        category: req.body.category
    };

    Article.create({
        title: article.title,
        body: article.body,
        slug: slugify(article.title),
        categoryId: article.category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", (req, res) => {

    const id = req.body.id;

    if (id == undefined) {

        res.redirect("/admin/articles");

    } else {

        Article.destroy({
            where: {
                id: id
            }
        })
            .then(() => {
                res.redirect("/admin/articles");
            });
    }
});

module.exports = router;