var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Contrat = require('../../models/Contrat.js');
var Competence = require('../../models/Competence.js');
var moment = require('moment');
var _ = require('underscore');
var shortid = require('shortid');
var async = require('async');


// Routes
Router.use(middleware.isLoggedIn, middleware.isEmployeur);

Router.get('/', function (req, res, next) {
    Employeur.findOne({
        userID: req.user.id
    }).populate('userID').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (employeur !== null) {
            Offre.find({
                employeur: employeur._id,
                etat: "Ouverte",
                $where: 'this.postulants.length>0'
            }).populate('competence').sort({
                postulants: -1
            }).exec(function (err, offres) {
                res.render('employeur/postulats/list', {
                    currentRoute: 'postulats',
                    user: employeur,
                    quotaOffres: req.flash('quotaOffres'),
                    offreRemoved: req.flash('offreRemoved'),
                    offres: offres
                })
            })
        } else {
            res.send('Null!');
        }

    })
});

Router.get('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    console.log(ID);
    Employeur.findById(req.user.profil.ID, function (err, employeur) {
        Offre.findById(ID).populate('competence').exec(function (err, offre) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            var postulants = offre.postulants;
            console.log(postulants);
            Freelancer.aggregate([{
                "$match": {
                    _id: {
                        "$in": offre.postulants
                    }
                },
            }, {
                "$addFields": {
                    "note_moy": {
                        "$avg": "$notations.note"
                    }
                }
            }, {
                "$sort": {
                    "note_moy": -1
                }
            }], function (err, postulants) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.render('employeur/postulats/postulants', {
                    currentRoute: 'postulats',
                    user: req.user,
                    offre: offre,
                    postulants: postulants
                });
            })
        });
    });
});

Router.get('/details/:id/contrat', function (req, res) {
    var idOffre = req.params.id;
    var idUser = req.query.idUser;
    Employeur.findById(req.user.profil.ID, function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Offre.findById(idOffre).populate('competence').exec(function (err, offre) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            Freelancer.aggregate([{
                "$match": {
                    _id: idUser
                },
            }, {
                "$addFields": {
                    "note_moy": {
                        "$avg": "$notations.note"
                    }
                }
            }, {
                "$sort": {
                    "note_moy": -1
                }
            }], function (err, aggregatedFreelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Competence.populate(aggregatedFreelancer, {
                    path: "competences"
                }, function (err, freelancer) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    };
                    res.render('employeur/contrats/ajout', {
                        currentRoute: "postulats",
                        user: employeur,
                        offre: offre,
                        freelancer: freelancer
                    })
                })
            })
        })
    })
});
Router.post('/details/:id/contrat/fin', function (req, res, next) {
    var idOffre = req.params.id;
    var idFreelancer = req.body.idFreelancer;
    var date = req.body.dateFin;
    var newContrat = new Contrat({
        employeur: req.user.profil.ID,
        freelancer: idFreelancer,
        offre: idOffre,
        dateFin: date
    })
    newContrat.save(function (err, contrat) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Offre.findByIdAndUpdate(idOffre, {
            etat: 'Négociation'
        }, function (err, result) {
            res.send({
                offre: result,
                contrat: contrat
            });
        });
    });
});
module.exports = Router;