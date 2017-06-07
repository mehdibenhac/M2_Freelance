// =============================
//     FREELANCER Employeurs
// =============================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Employeur = require('../../models/Employeur.js');
var Domaine = require('../../models/Domaine.js');

// Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var nomEmp = req.query.searchNom || "";
    var pnomEmp = req.query.searchPnom || "";
    var dom = req.query.dom;
    var noteMin = parseInt(req.query.noteMin) || 0;
    Freelancer.findById(req.user.profil.ID).populate("competences").exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        var domaines = [];
        freelancer.competences.forEach(function (competence) {
            domaines.push(competence.domaine);
        });
        console.log(domaines);
        if (typeof (dom) === 'undefined') {
            Employeur.aggregate([{
                    "$lookup": {
                        "from": "domaines",
                        "localField": "domaines",
                        "foreignField": "_id",
                        "as": "domaines"
                    }
                },
                {
                    "$addFields": {
                        "note_moy_employeur": {
                            "$avg": "$notations.note"
                        }
                    }
                },
                {
                    "$match": {
                        "domaines._id": {
                            $in: domaines
                        },
                        nom: {
                            $regex: nomEmp,
                            $options: 'i'
                        },
                        pnom: {
                            $regex: pnomEmp,
                            $options: 'i'
                        },
                        note_moy_employeur: {
                            "$gte": noteMin
                        }
                    }
                },
                {
                    "$sort": {
                        note_moy_employeur: -1,
                        nom: -1,
                        pnom: -1,
                    }
                }
            ]).exec(function (err, employeurs) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Domaine.find({
                    _id: {
                        $in: domaines
                    }
                }, function (err, domaines) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    res.render('./freelancer/employeurs/list', {
                        user: freelancer,
                        currentRoute: 'employeurs',
                        employeurs: employeurs,
                        domaines: domaines
                    });
                })
            });
        } else {
            Employeur.aggregate([{
                    "$lookup": {
                        "from": "domaines",
                        "localField": "domaines",
                        "foreignField": "_id",
                        "as": "domaines"
                    }
                },
                {
                    "$addFields": {
                        "note_moy_employeur": {
                            "$avg": "$notations.note"
                        }
                    }
                },
                {
                    "$match": {
                        "domaines._id": dom,
                        nom: {
                            $regex: nomEmp,
                            $options: 'i'
                        },
                        pnom: {
                            $regex: pnomEmp,
                            $options: 'i'
                        },
                        note_moy_employeur: {
                            "$gte": noteMin
                        }
                    }
                },
                {
                    "$sort": {
                        note_moy_employeur: -1,
                        nom: -1,
                        pnom: -1,
                    }
                }
            ]).exec(function (err, employeurs) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Domaine.find({
                    _id: {
                        $in: domaines
                    }
                }, function (err, domaines) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    res.render('./freelancer/employeurs/list', {
                        user: freelancer,
                        currentRoute: 'employeurs',
                        employeurs: employeurs,
                        domaines: domaines
                    });
                })
            });
        }


    });
});

Router.get('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    Freelancer.findById(req.user.profil.ID).exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Employeur.aggregate([{
                "$match": {
                    _id: ID
                }
            },
            {
                "$lookup": {
                    "from": "domaines",
                    "localField": "domaines",
                    "foreignField": "_id",
                    "as": "domaines"
                },
            },
            {
                "$addFields": {
                    "note_moy_employeur": {
                        "$avg": "$notations.note"
                    }
                }
            }
        ]).exec(function (err, employeur) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.render('freelancer/employeurs/details', {
                user: freelancer,
                employeur: employeur[0],
                currentRoute: 'employeurs'
            })
        });
    })
});


module.exports = Router;