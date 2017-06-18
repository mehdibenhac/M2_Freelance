// =========================
//      EMPLOYEUR INDEX
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Demande = require('../../models/Demande.js');
var Offre = require('../../models/Offre.js');
var Contrat = require('../../models/Contrat.js');
var User = require('../../models/User.js');
var Notification = require('../../models/Notification.js');
var moment = require('moment');


Router.get('/', middleware.isLoggedIn, middleware.isEmployeur, function (req, res) {
    Employeur.aggregate([{
                "$match": {
                    userID: req.user._id
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
                "$lookup": {
                    "from": "users",
                    "localField": "userID",
                    "foreignField": "_id",
                    "as": "userID"
                },
            },
            {
                "$addFields": {
                    "note_moy": {
                        "$avg": "$notations.note"
                    }
                }
            }
        ])
        .exec(function (err, employeur) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.render('./employeur/index', {
                messages: {
                    demandeExists: req.flash('demandeExists'),
                    profilValid: req.flash('profilValid'),
                    demandeCreated: req.flash('demandeCreated'),
                    employeurConnected: req.flash('employeurConnected'),
                    domainesModifSuccess: req.flash('domainesModifSuccess'),
                    supprImpossible: req.flash('supprImpossible')
                },
                currentRoute: 'profil',
                user: employeur[0]
            });
        });
});

Router.get('/validate', function (req, res, next) {
    Demande.findOne({
        "profil.ID": req.user.profil.ID,
        status: 'pending'
    }, function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (demande !== null) {
            req.flash('demandeExists', 'Vous avez dèja une demande de validation en cours traitement.')
            res.redirect('/employeur')
        } else {
            Demande.findOne({
                "profil.ID": req.user.profil.ID,
                status: 'processed'
            }, function (err, demande) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                if (demande !== null) {
                    req.flash('profilValid', 'Votre profil est dèja validé.')
                    res.redirect('/employeur')
                } else {
                    var newDemande = new Demande({
                        profil: {
                            accountType: "Employeur",
                            ID: req.user.profil.ID
                        },
                        status: 'pending'
                    });
                    newDemande.save(function (err, demande) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        if (demande) {
                            req.flash('demandeCreated', 'Votre demande de validation a été déposée.');
                            res.redirect('/employeur');
                        }
                    })
                }
            })
        }
    })
})

Router.get('/supprimer', function (req, res, next) {
    Offre.find({
        employeur: req.user.profil.ID,
        $or: [{
            etat: 'Ouverte'
        }, {
            etat: 'Négociation'
        }]
    }).exec(function (err, offres) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Contrat.find({
            employeur: req.user.profil.ID,
            $or: [{
                etat: 'Ouvert'
            }, {
                etat: 'Négociation'
            }, {
                etat: 'Cloturation'
            }]
        }).exec(function (err, contrats) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            if (offres.length > 0 || contrats.length > 0) {
                req.flash('supprImpossible', 'Suppression impossible. Vous avez un contrat ou offre en cours/négociation!')
                res.redirect('back');
            } else {
                Employeur.findByIdAndRemove(req.user.profil.ID, function (err, freelancer) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    User.findByIdAndRemove(req.user._id, function (err, user) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        Offre.deleteMany({
                            employeur: req.user.profil.ID
                        }, function (err, offres) {
                            if (err) {
                                console.log(err.stack)
                                return next(err);
                            }
                            Contrat.deleteMany({
                                employeur: req.user.profil.ID
                            }, function (err, contrats) {
                                if (err) {
                                    console.log(err.stack)
                                    return next(err);
                                }
                                Demande.deleteMany({
                                    "profil.ID": req.user.profil.ID
                                }, function (err, demandes) {
                                    if (err) {
                                        console.log(err.stack)
                                        return next(err);
                                    }
                                    req.logout();
                                    req.flash('suppr', 'Votre compte a été supprimé avec succés.');
                                    res.redirect('/login');
                                })
                            })
                        })
                    })
                })
            }
        })
    })
});
module.exports = Router;