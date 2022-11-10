const express = require("express");

const slugify = require("slugify")

const router = express.Router();

const Category = require("./Category")

//rotas GET
router.get("/admin/categories/new", (req,res)=>{
    res.render("admin/categories/new");
});

router.get("/admin/categories", (req,res)=>{

    Category.findAll().then((categories)=>{
        res.render("admin/categories/index", {categories: categories});
    });
});

router.get("/admin/categories/edit/:id", (req,res)=>{

    const id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then((category)=>{
        if (category == undefined) {
            res.redirect("/admin/categories")
        } else{
            res.render("admin/categories/edit", {category:category})
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});

//rotas POST
router.post("/categories/save", (req,res)=>{

    const title = req.body.title;

    if (title == undefined) {

        res.redirect("admin/categories/new");

    } else {
        
        Category.create({
            title:title,
            slug: slugify(title)
        })
        .then(()=>{
            res.redirect("/admin/categories");
        });
    };
});

router.post("/categories/delete",(req,res)=>{

    const id = req.body.id;

    if (id == undefined) {
    
        res.redirect("/admin/categories");
        
    } else {

            Category.destroy({
                where: {
                    id:id
                }
            })
            .then(()=>{
                res.redirect("/admin/categories");
            });
    }
});

router.post("/categories/update", (req,res)=>{

    const post = {
        id: req.body.id,
        title: req.body.title
    };

    Category.update({title: post.title, slug: slugify(post.title)}, {
        where: {
            id:post.id
        }
    })
    .then(()=>{
        res.redirect("/admin/categories");
    })
    .catch((err)=>{
        console.log(err);
        res.redirect("/admin/categories");
    })
});


module.exports = router;