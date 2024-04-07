const express = require("express");
const cors = require("cors");
const path = require("path")
const ejs = require("ejs")
const {PORT, host} = require("./lib/network")
const app = express();
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "public", "views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(cors());

app.get("/", (req, res) => res.render("index.html"));
app.get("/register", (req, res) => res.render("register.html"));
app.get("/login", (req, res) => res.render("login.html"));
app.get("/admin", (req, res) => res.render("admin.html"));

app.listen(PORT, () => {
    console.log(`Frontend Server is running ${host}`)
})