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
    var min = parseInt(req.query.min) || 0;
    var max = parseInt(req.query.max) || 999;
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
                Offre.aggregate([{
                        "$lookup": {
                            "from": "employeurs",
                            "localField": "employeur",
                            "foreignField": "_id",
                            "as": "employeur"
                        },
                    },
                    {
                        "$unwind": "$employeur"
                    },
                    {
                        "$match": {
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
                                etat: {
                                    $in: ["Ouverte", "Négociation"]
                                },
                                duree_min: {
                                    $gte: min
                                },
                                duree_max: {
                                    $lte: max
                                }
                            }]
                        }
                    },
                    {
                        "$lookup": {
                            "from": "competences",
                            "localField": "competence",
                            "foreignField": "_id",
                            "as": "competence"
                        },
                    },
                    {
                        "$unwind": "$competence"
                    },
                    {

                        "$addFields": {
                            "note_moy_employeur": {
                                "$avg": "$employeur.notations.note"
                            }
                        }

                    },
                    {
                        "$sort": {
                            "note_moy_employeur": -1,
                            "competence": -1,
                            "dateAjout": -1
                        }
                    }
                ]).exec(function (err, offres) {
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
            } else if (typeof (local) === 'undefined') {
                Offre.aggregate([{
                        "$lookup": {
                            "from": "employeurs",
                            "localField": "employeur",
                            "foreignField": "_id",
                            "as": "employeur"
                        },
                    },
                    {
                        "$unwind": "$employeur"
                    },
                    {
                        "$match": {
                            $and: [{
                                competence: compet
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
                                etat: {
                                    $in: ["Ouverte", "Négociation"]
                                },
                                duree_min: {
                                    $gte: min
                                },
                                duree_max: {
                                    $lte: max
                                }
                            }]
                        }
                    },
                    {
                        "$lookup": {
                            "from": "competences",
                            "localField": "competence",
                            "foreignField": "_id",
                            "as": "competence"
                        },
                    },
                    {
                        "$unwind": "$competence"
                    },
                    {

                        "$addFields": {
                            "note_moy_employeur": {
                                "$avg": "$employeur.notations.note"
                            }
                        }

                    },
                    {
                        "$sort": {
                            "note_moy_employeur": -1,
                            "competence": -1,
                            "dateAjout": -1
                        }
                    }
                ]).exec(function (err, offres) {
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
                Offre.aggregate([{
                        "$lookup": {
                            "from": "employeurs",
                            "localField": "employeur",
                            "foreignField": "_id",
                            "as": "employeur"
                        },
                    },
                    {
                        "$unwind": "$employeur"
                    },
                    {
                        "$match": {
                            $and: [{
                                competence: {
                                    $in: freelancer.competences
                                }
                            }, {
                                postulants: {
                                    $ne: req.user.profil.ID
                                }
                            }, {
                                titre: {
                                    $regex: search,
                                    $options: 'i'
                                },
                                localisation: local,
                                etat: {
                                    $in: ["Ouverte", "Négociation"]
                                },
                                duree_min: {
                                    $gte: min
                                },
                                duree_max: {
                                    $lte: max
                                }
                            }]
                        }
                    },
                    {
                        "$lookup": {
                            "from": "competences",
                            "localField": "competence",
                            "foreignField": "_id",
                            "as": "competence"
                        },
                    },
                    {
                        "$unwind": "$competence"
                    },
                    {

                        "$addFields": {
                            "note_moy_employeur": {
                                "$avg": "$employeur.notations.note"
                            }
                        }

                    },
                    {
                        "$sort": {
                            "note_moy_employeur": -1,
                            "competence": -1,
                            "dateAjout": -1
                        }
                    }
                ]).exec(function (err, offres) {
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
                Offre.aggregate([{
                        "$lookup": {
                            "from": "employeurs",
                            "localField": "employeur",
                            "foreignField": "_id",
                            "as": "employeur"
                        },
                    },
                    {
                        "$unwind": "$employeur"
                    },
                    {
                        "$match": {
                            $and: [{
                                competence: compet
                            }, {
                                postulants: {
                                    $ne: req.user.profil.ID
                                }
                            }, {
                                titre: {
                                    $regex: search,
                                    $options: 'i'
                                },
                                localisation: local,
                                etat: {
                                    $in: ["Ouverte", "Négociation"]
                                },
                                duree_min: {
                                    $gte: min
                                },
                                duree_max: {
                                    $lte: max
                                }
                            }]
                        }
                    },
                    {
                        "$lookup": {
                            "from": "competences",
                            "localField": "competence",
                            "foreignField": "_id",
                            "as": "competence"
                        },
                    },
                    {
                        "$unwind": "$competence"
                    },
                    {

                        "$addFields": {
                            "note_moy_employeur": {
                                "$avg": "$employeur.notations.note"
                            }
                        }

                    },
                    {
                        "$sort": {
                            "note_moy_employeur": -1,
                            "competence": -1,
                            "dateAjout": -1
                        }
                    }
                ]).exec(function (err, offres) {
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
        Offre.aggregate([{
                "$lookup": {
                    "from": "employeurs",
                    "localField": "employeur",
                    "foreignField": "_id",
                    "as": "employeur"
                },
            },
            {
                "$unwind": "$employeur"
            },
            {
                "$match": {
                    _id: ID
                }
            },
            {
                "$lookup": {
                    "from": "competences",
                    "localField": "competence",
                    "foreignField": "_id",
                    "as": "competence"
                },
            },
            {
                "$unwind": "$competence"
            },
            {
                "$lookup": {
                    "from": "freelancers",
                    "localField": "postulants",
                    "foreignField": "_id",
                    "as": "postulants"
                },
            },
            {
                "$addFields": {
                    "note_moy_employeur": {
                        "$avg": "$employeur.notations.note"
                    }
                }

            }
        ]).exec(function (err, offre) {
            if (err) {
                console.log(err.stack)
                return next(err);
            };
            res.render('freelancer/offres/details', {
                user: freelancer,
                offre: offre[0],
                currentRoute: 'offres'
            })
        });
    });

});

module.exports = Router;