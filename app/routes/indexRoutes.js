var Router = require('express').Router();

Router.get('/', function (req, res) {
    res.render('index');
});

module.exports = Router;