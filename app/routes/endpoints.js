var Router = require('express').Router();
var User = require('../models/User.js');
var Freelancer = require('../models/Freelancer.js');
var Employeur = require('../models/Employeur.js');
var Notification = require('../models/Notification.js');
var Message = require('../models/Message.js');
var Offre = require('../models/Offre.js');
var Utility = require('../utility.js');

// Freelancer

Router.put('/modifDispo', function (req, res, next) {
    console.log("modifDispo initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.disponibilite": true
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.disponibilite": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});
Router.put('/modifNotifOffres', function (req, res, next) {
    console.log("modifNotifOffres initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_offres": true
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_offres": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});
Router.put('/modifNotifEmps', function (req, res, next) {
    console.log("modifNotifEmps initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_employeurs": true
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Freelancer.findOneAndUpdate({
            userID: req.user._id
        }, {
            "parametres.notif_employeurs": false
        }, function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});

Router.put('/postuler', function (req, res, next) {
    console.log("Postuler initiated");
    var bool = req.body.checked;
    var idOffre = req.body.idOffre;
    if (bool === "true") {
        Offre.findByIdAndUpdate(idOffre, {
            $push: {
                postulants: req.user.profil.ID
            }
        }, function (err, offre) {
            Employeur.findById(offre.employeur).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Utility.notifyPostulat(employeur.userID, offre._id);
            });
            res.send('OK');
        })
    } else {
        Offre.findByIdAndUpdate(idOffre, {
            $pull: {
                postulants: req.user.profil.ID
            }
        }, function (err, offre) {
            console.log(offre.postulants)
            res.send('OK');
        })
    }
});
// Employeur

Router.put('/modifVisi', function (req, res, next) {
    console.log("modifVisi initiated");
    var bool = req.body.checked;
    if (bool === 'true') {
        Employeur.findOneAndUpdate({
            userID: req.user._id
        }, {
            "visibilite": true
        }, function (err, employeur) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to true');
        });
    } else if (bool === 'false') {
        console.log('Gonna set to false')
        Employeur.findOneAndUpdate({
            userID: req.user._id
        }, {
            "visibilite": false
        }, function (err, employeur) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send('Set to false');
        });
    }
});

Router.get('/notifsCount', function (req, res, next) {
    Notification.count({
        userID: req.user._id,
        lu: false
    }).exec(function (err, notifs) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        res.send({
            count: notifs
        });
    });
});
Router.get('/msgCount', function (req, res, next) {
    Message.count({
        destinataire: req.user._id,
        lu: false
    }).exec(function (err, msgs) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        res.send({
            count: msgs
        });
    });
});
module.exports = Router;