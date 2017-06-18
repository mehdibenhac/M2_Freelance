// =========================
//      EMPLOYEUR INDEX
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Demande = require('../../models/Demande.js');
var moment = require('moment');


Router.get('/', middleware.isLoggedIn, middleware.isEmployeur, function (req, res) {
    Employeur.findOne({
        userID: req.user._id
    }).populate('userID domaines').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        var dateCreated = moment(employeur.userID.dateCreated).format('D MMMM YYYY');
        var dateNaiss = moment(employeur.dateNaiss).format('D MMMM YYYY');
        res.render('./employeur/index', {
            messages: {
                demandeExists: req.flash('demandeExists'),
                profilValid: req.flash('profilValid'),
                demandeCreated: req.flash('demandeCreated'),
                employeurConnected: req.flash('employeurConnected'),
                domainesModifSuccess: req.flash('domainesModifSuccess')
            },
            currentRoute: 'profil',
            user: employeur,
            dateCreated: dateCreated,
            dateNaiss: dateNaiss
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
module.exports = Router;