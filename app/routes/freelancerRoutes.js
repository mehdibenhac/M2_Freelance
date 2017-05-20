var Router = require('express').Router();

Router.get('/signup', function (req, res) {
    res.render('freelancer/signup');
});

module.exports = Router;