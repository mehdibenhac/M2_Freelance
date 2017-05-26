// ========================
//     FREELANCER INDEX
// ========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var moment = require('moment');

// Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var user = req.user;
    Freelancer.findOne({
        userID: req.user._id
    }).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        var dateCreated = moment(freelancer.userID.dateCreated).format('D MMMM YYYY');
        var dateNaiss = moment(freelancer.dateNaiss).format('D MMMM YYYY');
        res.render('./freelancer/index', {
            messages: {
                freelancerConnected: req.flash('freelancerConnected'),
                demandeSupprimee: req.flash('demandeSupprimee')
            },
            user: freelancer,
            dateCreated: dateCreated,
            dateNaiss: dateNaiss
        });
    });
});


module.exports = Router;