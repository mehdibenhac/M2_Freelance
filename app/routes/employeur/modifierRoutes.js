// ===========================
//     Employeur MODIFIER
// ===========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var User = require('../../models/User.js');
var Domaine = require('../../models/Domaine.js');
var shortid = require('shortid');
var _ = require('underscore');
var moment = require('moment');

// ===== routes pour les modifications du profil

Router.get('/profil', middleware.isLoggedIn, middleware.isEmployeur, function (req, res) {
    var allowModif = true;
    var lastModified = ' Aucune';
    Employeur.findOne({
        userID: req.user._id
    }).populate('userID domainess').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (typeof (employeur.lastModified) !== "undefined") {
            lastModified = moment(employeur.lastModified);
            var now = moment();
            if (now.diff(lastModified, 'days') <= 7) {
                allowModif = false;
            }
            lastModified = moment(employeur.lastModified).format('D MMMM YYYY');
        }
        res.render('./employeur/modifierProfil', {
            messages: {
                modifierStatus: req.flash('modifierStatus'),
            },
            currentRoute: 'profil',
            lastModified: lastModified,
            user: employeur,
            allowModif: allowModif
        });
    });
});
Router.put('/profil', middleware.isLoggedIn, middleware.isEmployeur, function (req, res) {
    var user = req.user;
    Employeur.findOneAndUpdate({
        userID: req.user._id
    }, {
        email: req.body.email,
        telephone: req.body.telephone,
        wilayaAdr: req.body.wilayaAdr,
        communeAdr: req.body.communeAdr,
        quartierAdr: req.body.quartierAdr,
        lotissementAdr: req.body.lotissementAdr,
        lastModified: Date.now()
    }).exec(function (err, updated) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (updated !== null) {
            req.flash('modifierStatus', 'Profil modifié avec succés.')
            res.redirect('/employeur/modifier/profil');
        } else {
            req.flash('modifierStatus', 'Impossible de modifier le profil.')
            res.redirect('/employeur/modifier/profil');
        }

    });
});

// ===== routes pour les modifications des domaines

Router.get('/domaines', middleware.isLoggedIn, middleware.isEmployeur, function (req, res, next) {
    Employeur.findOne({
        userID: req.user._id
    }).populate('userID domaines').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (employeur !== null) {
            Domaine.find(function (err, domaines) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                if (domaines.length !== 0) {
                    res.render('employeur/modifierDomaines', {
                        currentRoute: 'profil',
                        sameDomaines: req.flash('sameDomaines'),
                        user: employeur,
                        domaines: domaines
                    })
                } else {
                    res.send('Null!');
                }
            })
        } else {
            res.send('Null!');
        }
    });
});
Router.put('/domaines', function (req, res, next) {
    Employeur.findOne({
        userID: req.user._id
    }).select('domaines').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (_.isEqual(req.body.domaines, employeur.domaines)) {
            req.flash('sameDomaines', 'Les domaines selectionnées sont les mêmes.');
            res.redirect('/employeur/modifier/domaines');
        } else if (employeur.domaines.length === 1 && req.body.compets === employeur.domaines[0]) {
            req.flash('sameDomaines', 'Les domaines selectionnées sont les mêmes.');
            res.redirect('/employeur/modifier/domaines');
        } else {
            employeur.domaines = req.body.domaines;
            employeur.save(function (err, savedEmployeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                req.flash('domainesModifSuccess', 'Domaines modifiée avec succés.');
                res.redirect('/employeur');
            });
        }
    });
});

module.exports = Router;