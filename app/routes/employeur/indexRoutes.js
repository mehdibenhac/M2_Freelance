// =========================
//      EMPLOYEUR INDEX
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');

Router.use(middleware.isLoggedIn, middleware.isEmployeur);
Router.get('/', function (req, res) {
    res.send('Employeur Index.');
});

module.exports = Router;