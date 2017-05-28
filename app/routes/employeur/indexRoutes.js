// =========================
//      EMPLOYEUR INDEX
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
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

module.exports = Router;