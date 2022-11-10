const express = require("express")

const app = express();

const session = require("express-session");

const bodyParser = require("body-parser");

//body-parser
app.use(bodyParser.urlencoded({ extend: false }));

//sessions
app.use(session({
    secret: "a1F4gPh7s8V493sDdf", cookie: {maxAge: 240000}
}))

//conexão do BD

const connection = require("./database/database");

//Importanto Controllers
const CategoriesController = require("./categories/CategoriesController");

const ArticlesController = require("./articles/ArticlesController");

const UsersController = require("./user/UserController");

//Importando Models
const Category = require("./categories/Category");

const Article = require("./articles/Article");

const User = require("./user/User");

const port = 8080;

app.listen(port, () => {
    console.log("o servidor esta rodando na porta: " + port);
});

//Database 
connection.authenticate()
    .then(() => {
        console.log("Sucesso na conexão com o banco de dados");
    })
    .catch((error) => {
        console.log(error);
    });

//Controllers
app.use("/", CategoriesController);

app.use("/", ArticlesController);

app.use("/", UsersController)

//view engine: ejs
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));


//rotas GET

app.get("/", (req, res) => {

    Article.findAll({
        order: [
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        });
    });
});

app.get("/:slug", (req, res) => {
    const slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    })
    .then(article => {
            if (article == undefined) {
                res.redirect("/");
            } else {
                Category.findAll().then(categories => {
                    res.render("article", { article: article, categories: categories });
                });
            };
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/");
        });
});

app.get("/category/:slug", (req, res)=>{

    const slug = req.params.slug;

    Category.findOne({
        where: {
            slug: slug
        }, include: [{model: Article}]
    }).then(category =>{
        if (category == undefined) {

            res.redirect("/");

        } else{

            Category.findAll().then(categories=>{

                res.render("index", {articles: category.articles, categories: categories});

            })
        }
    }).catch(err=>{

        console.log(err);

        res.redirect("/");

    });
});