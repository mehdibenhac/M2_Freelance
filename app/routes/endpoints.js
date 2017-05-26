var Router = require('express').Router();
var User = require('../models/User.js');
var Freelancer = require('../models/Freelancer.js');

Router.put('/modifDispo', function (req, res, next) {
    console.log("modifDispo initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.disponibilite": true
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.disponibilite": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});
Router.put('/modifNotifOffres', function (req, res, next) {
    console.log("modifNotifOffres initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_offres": true
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_offres": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});
Router.put('/modifNotifEmps', function (req, res, next) {
    console.log("modifNotifEmps initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_employeurs": true
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_employeurs": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});

module.exports = Router;