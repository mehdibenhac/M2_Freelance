// ===========================
//     FREELANCER MODIFIER
// ===========================


var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var Demande = require('../../models/Demande.js');
var moment = require('moment');


Router.get('/:id', function (req, res, next) {
    var ID = req.params.id;
    Demande.findOne({
        _id: ID
    }).populate('userID').exec(function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (demande !== null) {
            var dateCreated = moment(demande.dateCreated).format('D MMMM YYYY');
            console.log(dateCreated);
            res.render('./freelancer/demande/details', {
                demandeTrouvee: req.flash('demandeTrouvee'),
                user: demande.userID,
                demande: demande,
                dateCreated: dateCreated
            })
        }
    });
});

Router.delete('/:id', function (req, res, next) {
    var ID = req.params.id;
    Demande.findOneAndRemove({
        _id: ID
    }, function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (demande !== null) {
            req.flash('demandeSupprimee', 'Votre demande de verification a été supprimée.');
            res.redirect('/freelancer/');
        }
    });
});
module.exports = Router;