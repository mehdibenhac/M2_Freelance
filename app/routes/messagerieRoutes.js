var Router = require('express').Router(),
    moment = require('moment'),
    mongoose = require('mongoose'),
    middleware = require('../middleware.js'),
    passport = require('passport');

var Employeur = require('../models/Employeur.js');
var Freelancer = require('../models/Freelancer.js');
var User = require('../models/User.js');
var Message = require('../models/Message.js');

Router.get('/recus', function (req, res, next) {
    var user = req.user.profil.accountType;
    var userID = req.user.profil.ID;
    switch (user) {
        case "Employeur":
            Employeur.findById(userID).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Message
                    .find({
                        destinataire: req.user._id
                    })
                    .sort({
                        lu: 1,
                        dateCreated: -1
                    })
                    .populate('expediteur')
                    .populate({
                        path: 'expediteur',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .select('_id objet expediteur dateCreated lu')
                    .exec(function (err, messages) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('employeur/messagerie/recus', {
                            user: employeur,
                            messages: messages
                        });
                    });
            });
            break;
        case "Freelancer":
            Freelancer.findById(userID).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Message
                    .find({
                        destinataire: req.user._id
                    })
                    .sort({
                        lu: 1,
                        dateCreated: -1
                    })
                    .populate('expediteur')
                    .populate({
                        path: 'expediteur',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .select('_id objet expediteur dateCreated lu')
                    .exec(function (err, messages) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('freelancer/messagerie/recus', {
                            user: freelancer,
                            messages: messages
                        });
                    });
            });
            break;
    }
});
Router.get('/envoyes', function (req, res, next) {
    var user = req.user.profil.accountType;
    var userID = req.user.profil.ID;
    switch (user) {
        case "Employeur":
            Employeur.findById(userID).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Message
                    .find({
                        expediteur: req.user._id
                    })
                    .sort({
                        dateCreated: -1
                    })
                    .populate('destinataire')
                    .populate({
                        path: 'destinataire',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .select('_id objet destinataire dateCreated lu')
                    .exec(function (err, messages) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('employeur/messagerie/envoyes', {
                            msgEnvoye: req.flash('msgEnvoye'),
                            user: employeur,
                            messages: messages
                        });
                    });
            });
            break;
        case "Freelancer":
            Freelancer.findById(userID).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Message
                    .find({
                        expediteur: req.user._id
                    })
                    .sort({
                        dateCreated: -1
                    })
                    .populate('destinataire')
                    .populate({
                        path: 'destinataire',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .select('_id objet destinataire dateCreated lu')
                    .exec(function (err, messages) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('freelancer/messagerie/envoyes', {
                            msgEnvoye: req.flash('msgEnvoye'),
                            user: freelancer,
                            messages: messages
                        });
                    });
            });
            break;
    }
});
Router.get('/message/:id', function (req, res, next) {
    var ID = req.params.id;
    var user = req.user.profil.accountType;
    var userID = req.user.profil.ID;
    var self = false;
    switch (user) {
        case "Employeur":
            Employeur.findById(userID).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Message
                    .findById(ID)
                    .populate('destinataire expediteur')
                    .populate({
                        path: 'destinataire',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .populate({
                        path: 'expediteur',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .select('_id objet contenu destinataire expediteur dateCreated lu')
                    .exec(function (err, message) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        if (message.expediteur._id === req.user._id) {
                            self = true;
                        }
                        if (message.destinataire._id === req.user._id && message.lu !== true) {
                            message.lu = true;
                            message.save();
                        }
                        console.log(message.lu);
                        res.render('employeur/messagerie/details', {
                            user: employeur,
                            message: message,
                            selfy: self
                        });
                    });
            });
            break;
        case "Freelancer":
            Freelancer.findById(userID).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Message
                    .findById(ID)
                    .populate('destinataire expediteur')
                    .populate({
                        path: 'destinataire',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .populate({
                        path: 'expediteur',
                        populate: {
                            path: 'profil.ID',
                            select: '_id nom pnom'
                        }
                    })
                    .select('_id objet contenu destinataire expediteur dateCreated lu')
                    .exec(function (err, message) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        if (message.expediteur._id === req.user._id) {
                            self = true;
                        }
                        if (message.destinataire._id === req.user._id && message.lu !== true) {
                            message.lu = true;
                            message.save();
                        }
                        console.log(message.lu);
                        res.render('freelancer/messagerie/details', {
                            user: freelancer,
                            message: message,
                            selfy: self
                        });
                    });
            });
            break;
    }
});

Router.get('/nouveau/', function (req, res, next) {
    var dest = req.query.dest;
    var user = req.user.profil.accountType;
    var userID = req.user.profil.ID;
    switch (user) {
        case "Employeur":
            Employeur.findById(userID).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.render('employeur/messagerie/nouveau', {
                    sameUser: req.flash('sameUser'),
                    noUser: req.flash('noUser'),
                    user: employeur,
                    dest: dest
                })
            });
            break;
        case "Freelancer":
            Freelancer.findById(userID).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.render('freelancer/messagerie/nouveau', {
                    sameUser: req.flash('sameUser'),
                    noUser: req.flash('noUser'),
                    user: freelancer,
                    dest: dest
                })
            });
            break;
    }
});
Router.post('/nouveau/', function (req, res, next) {
    if (req.body.dest === req.user._id) {
        req.flash('sameUser', 'ID du destinataire invalide!');
        return res.redirect('back');
    }
    User.findById(req.body.dest).exec(function (err, user) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (user !== null) {
            var newMessage = new Message({
                objet: req.body.objet,
                contenu: req.body.contenu,
                expediteur: req.user._id,
                destinataire: req.body.dest
            });
            newMessage.save(function (err, message) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                req.flash('msgEnvoye', 'Message envoyé avec succés.')
                res.redirect('/messagerie/envoyes');
            });
        } else {
            req.flash('noUser', 'l\'ID saisi ne correspond à aucun utilisateur!');
            return res.redirect('back');
        }
    });
});
Router.delete('/message/:id', function (req, res, next) {
    var ID = req.params.id;
    Message.findByIdAndRemove(ID).exec(function (err, message) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        req.flash('msgRemoved', 'Message supprimé avec succés');
        res.redirect('/messagerie/recus');
    });
});
module.exports = Router;