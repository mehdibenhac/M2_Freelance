// =========================
//      Freelancer Offres
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Competence = require('../../models/Competence.js');
var Notification = require('../../models/Notification.js');
var moment = require('moment');
var shortid = require('shortid');
var async = require('async');


// Routes
Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', function (req, res, next) {
    var search = req.query.search || "";
    var compet = req.query.compet;
    var min = req.query.min || 0;
    var max = req.query.max || 999;
    var local = req.query.local;
    var fields = {
        search: search,
        compet: compet,
        min: min,
        max: max,
        local: local
    };
    console.log("typeof min: " + max);
    console.log(search);
    Freelancer.findOne({
        userID: req.user.id
    }).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (freelancer !== null) {
            if (typeof (compet) === 'undefined' && typeof (local) === 'undefined') {
                console.log('1')
                Offre.find({
                    $and: [{
                        competence: {
                            $in: freelancer.competences
                        }
                    }, {
                        $or: [{
                            localisation: freelancer.wilayaAdr
                        }, {
                            localisation: "Nationale"
                        }]
                    }, {
                        titre: {
                            $regex: search,
                            $options: 'i'
                        },
                        etat: "Ouverte",
                        duree_min: {
                            $gte: min
                        },
                        duree_max: {
                            $lte: max
                        }
                    }]
                }).populate('competence').sort({
                    dateAjout: 1,
                    localisation: 1,
                    competence: 1,
                    titre: 1
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('2');
                    Notification.count({
                        userID: req.user._id
                    }, function (err, notifCount) {
                        res.render('freelancer/offres/list', {
                            fields: fields,
                            user: freelancer,
                            offres: offres,
                            notifCount: notifCount
                        });
                    });
                });
            } else if (typeof (local) === 'undefined') {
                Offre.find({
                    $and: [{
                        competence: compet
                    }, {
                        $or: [{
                            localisation: freelancer.wilayaAdr
                        }, {
                            localisation: "Nationale"
                        }]
                    }, {
                        titre: {
                            $regex: search,
                            $options: 'i'
                        },
                        etat: "Ouverte",
                        duree_min: {
                            $gte: min
                        },
                        duree_max: {
                            $lte: max
                        }
                    }]
                }).populate('competence').sort({
                    dateAjout: 1,
                    localisation: 1,
                    competence: 1,
                    titre: 1
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('2');
                    Notification.count({
                        userID: req.user._id
                    }, function (err, notifCount) {
                        res.render('freelancer/offres/list', {
                            fields: fields,
                            user: freelancer,
                            offres: offres,
                            notifCount: notifCount
                        });
                    });
                });
            } else if (typeof (compet) === 'undefined') {
                console.log('1')
                Offre.find({
                    $and: [{
                        competence: {
                            $in: freelancer.competences
                        }
                    }, {
                        titre: {
                            $regex: search,
                            $options: 'i'
                        },
                        localisation: local,
                        etat: "Ouverte",
                        duree_min: {
                            $gte: min
                        },
                        duree_max: {
                            $lte: max
                        }
                    }]
                }).populate('competence').sort({
                    dateAjout: 1,
                    localisation: 1,
                    competence: 1,
                    titre: 1
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('2');
                    Notification.count({
                        userID: req.user._id
                    }, function (err, notifCount) {
                        res.render('freelancer/offres/list', {
                            fields: fields,
                            user: freelancer,
                            offres: offres,
                            notifCount: notifCount
                        });
                    });
                });
            } else {
                Offre.find({
                    $and: [{
                        competence: compet
                    }, {
                        titre: {
                            $regex: search,
                            $options: 'i'
                        },
                        localisation: local,
                        etat: "Ouverte",
                        duree_min: {
                            $gte: min
                        },
                        duree_max: {
                            $lte: max
                        }
                    }]
                }).populate('competence').sort({
                    dateAjout: 1,
                    localisation: 1,
                    competence: 1,
                    titre: 1
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('2');
                    Notification.count({
                        userID: req.user._id
                    }, function (err, notifCount) {
                        res.render('freelancer/offres/list', {
                            fields: fields,
                            user: freelancer,
                            offres: offres,
                            notifCount: notifCount
                        });
                    });
                });
            }
        } else {
            res.send('Offres lookup: Null!');
        }

    })
});

module.exports = Router;