// routes/index.js
const express = require("express");
const router = express.Router();

// Начална страница - login
router.get("/", (req, res) => {
  res.render("login");
});
 

// Начална страница (Home)
router.get("/home", (req, res) => {
  res.render("home");
});

// Дашборд
router.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

// Страница за учене
router.get("/learn", (req, res) => {
  res.render("learn");
});

// Страница за тестове
router.get("/test", (req, res) => {
  res.render("test");
});

module.exports = router;


 
 

router.get('/register', (req, res) => {
  res.render('register');
});

 

module.exports = router;
