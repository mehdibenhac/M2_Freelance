// =========================
//      Freelancer Offres
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Competence = require('../../models/Competence.js');
var moment = require('moment');
var _ = require('underscore');
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
    Freelancer.findOne({
        userID: req.user.id
    }).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (freelancer !== null) {
            if (typeof (compet) === 'undefined' && typeof (local) === 'undefined') {
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
                        postulants: {
                            $ne: req.user.profil.ID
                        }
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
                    dateAjout: -1
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('2');
                    res.render('freelancer/offres/list', {
                        fields: fields,
                        user: freelancer,
                        offres: offres,
                        currentRoute: 'offres'
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
                        },
                        {
                            postulants: {
                                $ne: req.user.profil.ID
                            }
                        },
                        {
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
                        }
                    ]
                }).populate('competence').sort({
                    dateAjout: -1,
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    res.render('freelancer/offres/list', {
                        fields: fields,
                        user: freelancer,
                        offres: offres,
                        currentRoute: 'offres'
                    });
                });
            } else if (typeof (compet) === 'undefined') {
                console.log('1')
                Offre.find({
                    $and: [{
                            competence: {
                                $in: freelancer.competences
                            }
                        },
                        {
                            postulants: {
                                $ne: req.user.profil.ID
                            }
                        },
                        {
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
                        }
                    ]
                }).populate('competence').sort({
                    dateAjout: -1,
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    res.render('freelancer/offres/list', {
                        fields: fields,
                        user: freelancer,
                        offres: offres,
                        currentRoute: 'offres'
                    });
                });
            } else {
                Offre.find({
                    $and: [{
                            competence: compet
                        },
                        {
                            postulants: {
                                $ne: req.user.profil.ID
                            }
                        },
                        {
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
                        }
                    ]
                }).populate('competence').sort({
                    dateAjout: -1
                }).exec(function (err, offres) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    res.render('freelancer/offres/list', {
                        fields: fields,
                        user: freelancer,
                        offres: offres,
                        currentRoute: 'offres'
                    });
                });
            }
        } else {
            res.send('Offres lookup: Null!');
        }

    })
});
Router.get('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    Freelancer.findById(req.user.profil.ID).exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Offre.findById(ID).populate('employeur postulants competence').exec(function (err, offre) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            console.log(_.any(offre.postulants, function (item) {
                console.log("ITEM : ", typeof (item));
                console.log("FREELANCER : ", typeof (freelancer));
                return item._id === freelancer._id;
            }));
            res.render('freelancer/offres/details', {
                user: freelancer,
                offre: offre,
                currentRoute: 'offres'
            })
        });
    });

});

module.exports = Router;