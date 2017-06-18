var Router = require('express').Router();
var User = require('../models/User.js');
var Freelancer = require('../models/Freelancer.js');
var Employeur = require('../models/Employeur.js');
var Notification = require('../models/Notification.js');
var Competence = require('../models/Competence.js');
var Message = require('../models/Message.js');
var Offre = require('../models/Offre.js');
var Utility = require('../utility.js');
var passport = require('passport');

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
    if (req.isAuthenticated()) {
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
    } else {
        res.send('User not connected');
    }

});
Router.get('/msgCount', function (req, res, next) {
    if (req.isAuthenticated()) {
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
    } else {
        res.send('User not connected');
    }

});

Router.post('/adminLogin', function (req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
        }
        if (!user) {
            return res.status(400).send('No user found');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            res.status(200).send('User connected');
        });
    })(req, res, next);
});

Router.post('/competences', function (req, res, next) {
    Competence.find({
        domaine: req.body.domaine
    }, function (err, competences) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        res.send(competences);
    });
})
module.exports = Router;