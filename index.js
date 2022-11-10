const express = require("express")

const app = express();

const port = 8080;

const bodyParser = require("body-parser");

const connection = require("./database/database")

app.listen(port, () => {
    console.log("o servidor esta rodando na porta: " + port);
});

//Database 
connection.authenticate()
    .then(() => {
        console.log("Sucesso na conexão com o banco de dados")
    })
    .catch((error) => {
        console.log(error);
    })

//view engine: ejs
app.set("view engine", "ejs");

//Static
app.use(express.static("public"))

//body-parser
app.use(bodyParser.urlencoded({ extend: false }));

app.get("/", (req, res) => {
    req.send("index")
});