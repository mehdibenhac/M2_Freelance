// ========================
//     FREELANCER INDEX
// ========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Contrat = require('../../models/Contrat.js');
var Demande = require('../../models/Demande.js');
var User = require('../../models/User.js');
var Notification = require('../../models/Notification.js');

// Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    Freelancer.aggregate([{
            "$match": {
                userID: req.user._id
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
    ]).exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        console.log(freelancer[0])
        res.render('./freelancer/index', {
            messages: {
                freelancerConnected: req.flash('freelancerConnected'),
                demandeSupprimee: req.flash('demandeSupprimee'),
                noValid: req.flash('noValid'),
                competModifSuccess: req.flash('competModifSuccess'),
                supprImpossible: req.flash('supprImpossible')
            },
            user: freelancer[0],
            currentRoute: 'profil'
        });
    });
});

Router.get('/supprimer', function (req, res, next) {
    Offre.find({
        postulants: req.user.profil.ID,
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
            freelancer: req.user.profil.ID,
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
                Freelancer.findByIdAndRemove(req.user.profil.ID, function (err, freelancer) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    User.findByIdAndRemove(req.user._id, function (err, user) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        Offre.updateMany({
                            postulants: req.user.profil.ID
                        }, {
                            $pull: {
                                postulants: req.user.profil.ID
                            }
                        }, function (err, offres) {
                            if (err) {
                                console.log(err.stack)
                                return next(err);
                            }
                            Contrat.deleteMany({
                                freelancer: req.user.profil.ID
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