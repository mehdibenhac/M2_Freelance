var Router = require('express').Router();
var User = require('../models/User.js');
var Offre = require('../models/Offre.js');
var Freelancer = require('../models/Freelancer.js');
var Utility = require('../utility.js');

Router.get('/', function (req, res) {
    var step = req.query.step;
    console.log(step);
    switch (step) {
        case undefined:
            res.render('test');
            break;
        case "2":
            if (req.session.fields) {
                res.render('test2', {
                    session: req.session
                });
            } else {
                res.redirect('test');
            }

            break;
        default:
            res.send('Error');
    }
});
Router.post('/', function (req, res) {
    if (!req.query.reset || typeof req.query.reset === 'undefined') {
        var field1 = req.body.field1;
        var field2 = req.body.field2;
        req.session.fields = {
            field1: field1,
            field2: field2
        }
        res.redirect('test?step=2');
    } else {
        delete req.session["fields"];
        res.redirect('test')
    }

});
Router.get('/ajax', function (req, res, next) {
    Freelancer.findById('rJNaPMN--', function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        res.render('ajaxTEST', {
            parametres: freelancer.parametres
        })
    })
});
Router.put('/ajax/testing', function (req, res, next) {
    var bool = req.body.checked;
    console.log(req.body);
    if (bool === 'true') {
        Freelancer.findByIdAndUpdate('rJNaPMN--', {
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
        Freelancer.findByIdAndUpdate('rJNaPMN--', {
            "parametres.disponibilite": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
    // User.findOne({
    //     username: val
    // }).exec(function (err, foundUser) {
    //     if (err) {
    //         console.log(err.stack)
    //         return next(err);
    //     }
    //     console.log(foundUser._id);
    //     res.send(foundUser);
    // });
});

Router.get('/testAggregate', function (req, res, next) {
    // Freelancer.aggregate([{
    //         "$unwind": "$notations"
    //     },
    //     {
    //         "$group": {
    //             _id: null,
    //             note_moy: {
    //                 "$avg": "$notations.note"
    //             }
    //         }
    //     }
    // ], function (err, results) {
    //     res.send(results);
    // })
    Freelancer.aggregate(
        [{
                $project: {
                    nom: "$nom",
                    pnom: "$pnom",
                    note_Moyenne: {
                        $divide: [{
                            $reduce: {
                                input: "$notations.note",
                                initialValue: 0,
                                in: {
                                    $sum: ["$$value", "$$this"]
                                }
                            }
                        }, {
                            $size: "$notations"
                        }]
                    }
                }
            },
            {
                $sort: {
                    note_Moyenne: -1
                }
            }
        ],
        function (err, results) {
            res.send(results);
        });
});

Router.get('/notifier', function (req, res, next) {
    var compet = "HkGT5aMbb";
    var offre = "H1ltpzcKb-";
    var targets = [];
    Freelancer.find({
        competences: compet
    }).exec(function (err, freelancers) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        freelancers.forEach(function (freelancer) {
            targets.push(freelancer.userID);
        });
        Utility.notifyOffre(targets, offre);
        res.send(targets);
    });
});

Router.get('/sidebar', function (req, res, next) {
    res.render('sidebarTest');
});

Router.get('/01', function (req, res, next) {
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
        res.json(offres);
    });
});
module.exports = Router;