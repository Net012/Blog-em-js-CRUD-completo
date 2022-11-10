const express = require("express");
const bcrypt = require("bcryptjs")
const { route } = require("../articles/ArticlesController");
const router = express.Router();
const User = require("./User")
const adminAuth = require("../middlewares/adminAuth");

//rotas GET
router.get("/admin/users",adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users })
    })
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.get("logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/")
})


//rotas POST
router.post("/users/create", (req, res) => {
    var create = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({ where: { email: create.email } }).then(user => {
        if (user == undefined) {

            const salt = bcrypt.genSaltSync(10)

            const hash = bcrypt.hashSync(create.password, salt)

            User.create({
                email: create.email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch(err => {
                console.log(err);
                res.redirect("/")
            })
        } else {
            res.redirect("/admin/users/create")
        }
    }).catch(err => {
        console.log(err);
    })
})

router.post("/authenticate", (req, res) => {

    const guest = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({
        where: {
            email: guest.email
        }
    }).then(user => {
        if (user == undefined) {

            res.render("/login")

        } else {
            const correct = bcrypt.compareSync(guest.password, user.password)

            if (correct) {

                req.session.user = {

                    id: user.id,
                    email: user.email

                }

                res.redirect("/")

            } else {
                res.render("/login")
            }

        }
    })

})

module.exports = router