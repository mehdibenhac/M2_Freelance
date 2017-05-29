// ========================
//     FREELANCER INDEX
// ========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Notification = require('../../models/Notification.js');

// Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    Freelancer.findById(req.user.profil.ID).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        res.render('./freelancer/index', {
            messages: {
                freelancerConnected: req.flash('freelancerConnected'),
                demandeSupprimee: req.flash('demandeSupprimee'),
                noValid: req.flash('noValid'),
                competModifSuccess: req.flash('competModifSuccess'),
            },
            user: freelancer,
            currentRoute: 'profil'
        });
    });
});


module.exports = Router;