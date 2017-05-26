// ===========================
//     FREELANCER MODIFIER
// ===========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Demande = require('../../models/Demande.js');
var moment = require('moment');



Router.get('/profil', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var user = req.user;
    var allowModif = true;
    var lastModified = 'Aucune modification enregistrée';
    Freelancer.findOne({
        userID: req.user._id
    }).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (typeof (freelancer.lastModified) !== "undefined") {
            lastModified = moment(freelancer.lastModified);
            var now = moment();
            if (now.diff(lastModified, 'days') <= 7) {
                allowModif = false;
            }
            lastModified = moment(freelancer.lastModified).format('D MMMM YYYY');
        }
        res.render('./freelancer/modifierProfil', {
            messages: {
                modifierStatus: req.flash('modifierStatus'),
            },
            lastModified: lastModified,
            user: freelancer,
            allowModif: allowModif
        });
    });
});

Router.put('/profil', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var user = req.user;
    Freelancer.findOneAndUpdate({
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
            res.redirect('/freelancer/modifier/profil');
        } else {
            req.flash('modifierStatus', 'Impossible de modifier le profil.')
            res.redirect('/freelancer/modifier/profil');
        }

    });
});

Router.get('/competences', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var user = req.user;
    console.log(req.user._id);
    Demande.findOne({
        userID: req.user._id
    }, function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (demande !== null) {
            req.flash('demandeTrouvee', 'Vous avez une demande en attente de traitement.')
            res.redirect('/freelancer/demande/' + demande._id);
        } else {
            res.send('Pas de demande!');
        }
    });
});
module.exports = Router;