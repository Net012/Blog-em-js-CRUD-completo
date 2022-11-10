const express = require("express")

const app = express();

const bodyParser = require("body-parser");

const connection = require("./database/database");

const CategoriesController = require("./categories/CategoriesController");

const ArticlesController = require("./articles/ArticlesController");

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


//Rotas
app.use("/", CategoriesController);

app.use("/", ArticlesController);



//view engine: ejs
app.set("view engine", "ejs");

//Static
app.use(express.static("public"));

//body-parser
app.use(bodyParser.urlencoded({ extend: false }));

app.get("/", (req, res) => {
    req.send("index");
});