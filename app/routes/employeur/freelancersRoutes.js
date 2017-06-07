// =============================
//     EMPLOYEUR Freelancers
// =============================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Employeur = require('../../models/Employeur.js');
var Competence = require('../../models/Competence.js');

// Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', middleware.isLoggedIn, middleware.isEmployeur, function (req, res, next) {
    var nomFree = req.query.searchNom || "";
    var pnomFree = req.query.searchPnom || "";
    var comp = req.query.comp;
    var noteMin = parseInt(req.query.noteMin) || 0;
    Employeur.findById(req.user.profil.ID).exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Competence.find().populate('domaine').exec(function (err, competences) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            // This is intended for sorting through domaine.titre since mongoose is rather wonky when 
            // it comes to sorting by populated fields.
            competences.sort(function (a, b) {
                var titreA = a.domaine.titre.toUpperCase();
                var titreB = b.domaine.titre.toUpperCase();
                if (titreA < titreB) {
                    return -1
                }
                if (titreA > titreB) {
                    return 1
                }
                return 0;
            });
            if (typeof (comp) === 'undefined') {
                Freelancer.aggregate([{
                        "$lookup": {
                            "from": "competences",
                            "localField": "competences",
                            "foreignField": "_id",
                            "as": "competences"
                        }
                    },
                    {
                        "$addFields": {
                            "note_moy_freelancer": {
                                "$avg": "$notations.note"
                            }
                        }
                    },
                    {
                        "$match": {
                            nom: {
                                "$regex": nomFree,
                                "$options": 'i'
                            },
                            pnom: {
                                "$regex": pnomFree,
                                "$options": 'i'
                            },
                            "note_moy_freelancer": {
                                "$gte": noteMin
                            }
                        }
                    },
                    {
                        "$sort": {
                            "note_moy_freelancer": -1,
                            "nom": -1,
                            "pnom": -1
                        }
                    }
                ]).exec(function (err, freelancers) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log(freelancers);
                    res.render('employeur/freelancers/list', {
                        user: employeur,
                        freelancers: freelancers,
                        competences: competences,
                        currentRoute: 'freelancers'
                    });
                });
            } else {
                Freelancer.aggregate([{
                        "$lookup": {
                            "from": "competences",
                            "localField": "competences",
                            "foreignField": "_id",
                            "as": "competences"
                        }
                    },
                    {
                        "$addFields": {
                            "note_moy_freelancer": {
                                "$avg": "$notations.note"
                            }
                        }
                    },
                    {
                        "$match": {
                            "competences._id": comp,
                            nom: {
                                "$regex": nomFree,
                                "$options": 'i'
                            },
                            pnom: {
                                "$regex": pnomFree,
                                "$options": 'i'
                            },
                            "note_moy_freelancer": {
                                "$gte": noteMin
                            }
                        }
                    },
                    {
                        "$sort": {
                            "note_moy_freelancer": -1,
                            "nom": -1,
                            "pnom": -1
                        }
                    }
                ]).exec(function (err, freelancers) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log(freelancers);
                    res.render('employeur/freelancers/list', {
                        user: employeur,
                        freelancers: freelancers,
                        competences: competences,
                        currentRoute: 'freelancers'
                    });
                });
            }

        });
    });
    // Freelancer.findById(req.user.profil.ID).populate("competences").exec(function (err, freelancer) {
    //     if (err) {
    //         console.log(err.stack)
    //         return next(err);
    //     }
    //     var domaines = [];
    //     freelancer.competences.forEach(function (competence) {
    //         domaines.push(competence.domaine);
    //     });
    //     console.log(domaines);
    //     if (typeof (dom) === 'undefined') {
    //         Employeur.aggregate([{
    //                 "$lookup": {
    //                     "from": "domaines",
    //                     "localField": "domaines",
    //                     "foreignField": "_id",
    //                     "as": "domaines"
    //                 }
    //             },
    //             {
    //                 "$addFields": {
    //                     "note_moy_employeur": {
    //                         "$avg": "$notations.note"
    //                     }
    //                 }
    //             },
    //             {
    //                 "$match": {
    //                     "domaines._id": {
    //                         $in: domaines
    //                     },
    //                     nom: {
    //                         $regex: nomEmp,
    //                         $options: 'i'
    //                     },
    //                     pnom: {
    //                         $regex: pnomEmp,
    //                         $options: 'i'
    //                     },
    //                     note_moy_employeur: {
    //                         "$gte": noteMin
    //                     }
    //                 }
    //             },
    //             {
    //                 "$sort": {
    //                     note_moy_employeur: -1,
    //                     nom: -1,
    //                     pnom: -1,
    //                 }
    //             }
    //         ]).exec(function (err, employeurs) {
    //             if (err) {
    //                 console.log(err.stack)
    //                 return next(err);
    //             }
    //             Domaine.find({
    //                 _id: {
    //                     $in: domaines
    //                 }
    //             }, function (err, domaines) {
    //                 if (err) {
    //                     console.log(err.stack)
    //                     return next(err);
    //                 }
    //                 res.render('./freelancer/employeurs/list', {
    //                     user: freelancer,
    //                     currentRoute: 'employeurs',
    //                     employeurs: employeurs,
    //                     domaines: domaines
    //                 });
    //             })
    //         });
    //     } else {
    //         Employeur.aggregate([{
    //                 "$lookup": {
    //                     "from": "domaines",
    //                     "localField": "domaines",
    //                     "foreignField": "_id",
    //                     "as": "domaines"
    //                 }
    //             },
    //             {
    //                 "$addFields": {
    //                     "note_moy_employeur": {
    //                         "$avg": "$notations.note"
    //                     }
    //                 }
    //             },
    //             {
    //                 "$match": {
    //                     "domaines._id": dom,
    //                     nom: {
    //                         $regex: nomEmp,
    //                         $options: 'i'
    //                     },
    //                     pnom: {
    //                         $regex: pnomEmp,
    //                         $options: 'i'
    //                     },
    //                     note_moy_employeur: {
    //                         "$gte": noteMin
    //                     }
    //                 }
    //             },
    //             {
    //                 "$sort": {
    //                     note_moy_employeur: -1,
    //                     nom: -1,
    //                     pnom: -1,
    //                 }
    //             }
    //         ]).exec(function (err, employeurs) {
    //             if (err) {
    //                 console.log(err.stack)
    //                 return next(err);
    //             }
    //             Domaine.find({
    //                 _id: {
    //                     $in: domaines
    //                 }
    //             }, function (err, domaines) {
    //                 if (err) {
    //                     console.log(err.stack)
    //                     return next(err);
    //                 }
    //                 res.render('./freelancer/employeurs/list', {
    //                     user: freelancer,
    //                     currentRoute: 'employeurs',
    //                     employeurs: employeurs,
    //                     domaines: domaines
    //                 });
    //             })
    //         });
    //     }


    // });
});

Router.get('/details/:id', middleware.isLoggedIn, middleware.isEmployeur, function (req, res, next) {
    var ID = req.params.id;
    Employeur.findById(req.user.profil.ID).exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Freelancer.aggregate([{
                "$match": {
                    _id: ID
                }
            },
            {
                "$lookup": {
                    "from": "competences",
                    "localField": "competences",
                    "foreignField": "_id",
                    "as": "competences"
                },
            },
            {
                "$addFields": {
                    "note_moy_freelancer": {
                        "$avg": "$notations.note"
                    }
                }
            }
        ]).exec(function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.render('employeur/freelancers/details', {
                user: employeur,
                freelancer: freelancer[0],
                currentRoute: 'freelancers'
            })
        });
    })
});


module.exports = Router;