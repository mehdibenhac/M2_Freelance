// ========================
//     FREELANCER INDEX
// ========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Notification = require('../../models/Notification.js');
var moment = require('moment');

// Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    Freelancer.findOne({
        userID: req.user._id
    }).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        var dateCreated = moment(freelancer.userID.dateCreated).format('D MMMM YYYY');
        var dateNaiss = moment(freelancer.dateNaiss).format('D MMMM YYYY');
        var notifCount = 0;
        Notification.count({
            userID: req.user._id
        }, function (err, countNotifs) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.render('./freelancer/index', {
                messages: {
                    freelancerConnected: req.flash('freelancerConnected'),
                    demandeSupprimee: req.flash('demandeSupprimee'),
                    noValid: req.flash('noValid'),
                    competModifSuccess: req.flash('competModifSuccess')
                },
                notifCount: countNotifs,
                user: freelancer,
                dateCreated: dateCreated,
                dateNaiss: dateNaiss
            });
        });
    });
});


module.exports = Router;