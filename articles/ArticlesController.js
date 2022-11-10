const express = require("express");

const router = express.Router();

const Category = require("../categories/Category");

const Article = require("./Article");

const slugify = require("slugify");

const adminAuth = require("../middlewares/adminAuth");

//rotas GET
router.get("/admin/articles", adminAuth, (req, res) => {

    Article.findAll({
        include: [
            { model: Category }
        ]
    })
        .then(articles => {
            res.render("admin/articles/index", { articles: articles });
        });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories });
    });
});

router.get("/admin/articles/edit/:id", adminAuth, (req,res)=>{

    const id = req.params.id;

    Article.findByPk(id).then(article=>{
        if (article == undefined) {
            res.redirect("/");
        } else{

            Category.findAll().then(categories=>{

                res.render("admin/articles/edit",{article:article, categories:categories});

            })    
        }
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("/");
    })
});

router.get("/articles/page/:num",(req,res)=>{

    const page = req.params.num

    let offset = 0

    if (isNaN(page)|| page == 1) {
        offset = 0
    } else { 
        offset = (parseInt(page)-1) * 4
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ["id", "DESC"]
        ]
    }).then(articles=>{

        let next

        if (offset + 4 >= articles.count ) {
            next = false
        } else{
            next = true
        } 
        
        const result = {
            page: parseInt(page),
            articles: articles,
            next: next
        }

        Category.findAll().then(categories=>{
            res.render("admin/articles/page", {result:result, categories: categories})
        })

      
    })

})

//rotas POST
router.post("/articles/save", adminAuth, (req, res) => {
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

router.post("/articles/delete",adminAuth, (req, res) => {

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

router.post("/articles/update",adminAuth, (req,res)=>{

    const id = {
        id: req.body.id,
        title: req.body.title,
        body: req.body.body,
        category: req.body.category
    }

    Article.update({
        title: id.title,
        body: id.body,
        categoryId: id.category,
        slug: slugify(id.title)
    })
    .then(()=>{
        res.redirect("/admin/articles")
    })
    .catch(err=>{
        console.log(err);
        res.redirect("/")
    })
});



module.exports = router;