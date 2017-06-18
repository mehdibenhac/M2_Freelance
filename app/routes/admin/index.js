var Router = require('express').Router();
var User = require('../../models/User.js');
var Freelancer = require('../../models/Freelancer.js');
var Employeur = require('../../models/Employeur.js');
var Administrateur = require('../../models/Administrateur.js');
var Offre = require('../../models/Offre.js');
var Contrat = require('../../models/Contrat.js');
var Message = require('../../models/Message.js');
var Notification = require('../../models/Notification.js');
var Demande = require('../../models/Demande.js');
var passport = require('passport');
var moment = require('moment');
var path = require('path');

Router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,$");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, $");
	next();
});

Router.get('/', function (req, res, next) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

Router.post('/signup', function (req, res, next) {
	var password = req.body.password;
	var newUser = new User({
		username: req.body.username,
	});
	var newAdmin = new Administrateur({
		userID: newUser._id,
		nom: req.body.nom,
		pnom: req.body.pnom,
		email: req.body.email,
		telephone: req.body.telephone
	});
	newUser.profil = {
		accountType: "Administrateur",
		ID: newAdmin._id
	};
	newAdmin.save(function (err, admin) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		User.register(newUser, password, function (err, user) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			res.send({
				user: user,
				admin: admin
			});
		});
	});

});

Router.post('/login', function (req, res, next) {
	console.log(req.headers);
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
		}
		if (!user) {
			req.session.loginAttempts = 0;
			return res.status(200).send({
				status: 'noUser'
			});
		}
		if (user.profil.accountType !== "Administrateur") {
			req.session.loginAttempts = 0;
			return res.status(200).send({
				status: 'notAdmin'
			});
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err)
			}
			req.session.loginAttempts = 0;
			res.status(200).send({
				status: 'ok',
				user: req.user
			});
		});
	})(req, res, next);
});

Router.get('/signout', function (req, res, next) {
	if (req.isAuthenticated()) {
		req.logout();
		return res.send('ok');
	} else {
		return res.send('no');
	}
});

Router.get('/auth', function (req, res, next) {
	if (req.isAuthenticated()) {
		return res.send('ok');
	} else {
		return res.send('no');
	}
});

Router.get('/profil', function (req, res, next) {
	User.findById(req.user._id).populate('profil.ID').exec(function (err, admin) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.status(200).send(admin);
	});
});
Router.get('/comptes', function (req, res, next) {
	Employeur.aggregate([{
			$lookup: {
				"from": "domaines",
				"localField": "domaines",
				"foreignField": "_id",
				"as": "domaines"
			}
		},
		{
			$addFields: {
				"note_moy": {
					"$avg": "$notations.note"
				}
			}
		},
		{
			$sort: {
				note_moy: -1,
				nom: 1,
				pnom: 1
			}
		}
	]).exec(function (err, employeurs) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		Freelancer.aggregate([{
				$lookup: {
					"from": "competences",
					"localField": "competences",
					"foreignField": "_id",
					"as": "competences"
				}
			},
			{
				$addFields: {
					"note_moy": {
						"$avg": "$notations.note"
					}
				}
			},
			{
				$sort: {
					note_moy: -1,
					nom: 1,
					pnom: 1
				}
			}
		]).exec(function (err, freelancers) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			res.status(200).send({
				freelancers: freelancers,
				employeurs: employeurs
			});
		})
	})
});

// Freelancer CRUD
Router.get('/freelancers', function (req, res, next) {
	Freelancer.aggregate([{
			$lookup: {
				"from": "competences",
				"localField": "competences",
				"foreignField": "_id",
				"as": "competences"
			}
		},
		{
			$addFields: {
				"note_moy": {
					"$avg": "$notations.note"
				}
			}
		},
		{
			$sort: {
				note_moy: -1,
				nom: 1,
				pnom: 1
			}
		}
	]).exec(function (err, freelancers) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		console.log(freelancers);
		res.status(200).send({
			freelancers: freelancers
		});
	})
});
Router.put('/freelancer', function (req, res, next) {
	Freelancer.findByIdAndUpdate(req.body._id, {
		$set: {
			nom: req.body.nom,
			pnom: req.body.pnom,
			dateNaiss: req.body.dateNaiss,
			lieuNaiss: req.body.lieuNaiss
		}
	}, function (err, freelancer) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		var newNotif = new Notification({
			userID: freelancer.userID,
			titre: "Votre profil a été modifié.",
			contenu: "<p> Un administrateur vient de modifier les informations de votre profil." +
				"<br> <b>Nom:</b> " + req.body.nom +
				"<br> <b>Prénom:</b> " + req.body.pnom +
				"<br> <b>Date de naissance:</b>  " + moment(req.body.dateNaiss).format('DD/MM/YYYY') +
				"<br> <b>Lieu de naissace:</b>  " + req.body.lieuNaiss + "</p>"
		});
		newNotif.save();
		res.send(freelancer);
	});
});
Router.delete('/freelancer', function (req, res, next) {
	var offresIDs = [];
	var contratsIDs = [];
	console.log(req.body)
	Offre.updateMany({
		postulants: req.body._id
	}, {
		$pull: {
			postulants: req.body._id
		}
	}, function (err, offres) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		Contrat.deleteMany({
			freelancer: req.body._id
		}, function (err, contrats) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			Demande.deleteMany({
				"profil.ID": req.body._id
			}, function (err, demandes) {
				if (err) {
					console.log(err.stack)
					return next(err);
				}
				Freelancer.findByIdAndRemove(req.body._id, function (err, freelancer) {
					if (err) {
						console.log(err.stack)
						return next(err);
					}
					console.log(freelancer)
					User.findByIdAndRemove(freelancer.userID, function (err, user) {
						if (err) {
							console.log(err.stack)
							return next(err);
						}
						res.send({
							'user': user,
							'freelancer': freelancer,
							'offres': offres,
							'contrats': contrats,
							'demandes': demandes
						});
					})
				})
			});

		});
	})
});
// Employeur RUD
Router.get('/employeurs', function (req, res, next) {
	Employeur.aggregate([{
			$lookup: {
				"from": "domaines",
				"localField": "domaines",
				"foreignField": "_id",
				"as": "domaines"
			}
		},
		{
			$addFields: {
				"note_moy": {
					"$avg": "$notations.note"
				}
			}
		},
		{
			$sort: {
				note_moy: -1,
				nom: 1,
				pnom: 1
			}
		}
	]).exec(function (err, employeurs) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.status(200).send({
			employeurs: employeurs
		});
	})
});
Router.put('/employeur', function (req, res, next) {
	Employeur.findByIdAndUpdate(req.body._id, {
		$set: {
			nom: req.body.nom,
			pnom: req.body.pnom,
			dateNaiss: req.body.dateNaiss,
			nomEntreprise: req.body.nomEntreprise,
			lieuNaiss: req.body.lieuNaiss
		}
	}, function (err, employeur) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		var newNotif = new Notification({
			userID: employeur.userID,
			titre: "Votre profil a été modifié.",
			contenu: "<p> Un administrateur vient de modifier les informations de votre profil." +
				"<br> <b>Nom:</b> " + req.body.nom +
				"<br> <b>Prénom:</b> " + req.body.pnom +
				"<br> <b>Nom d'entreprise:</b>  " + req.body.nomEntreprise +
				"<br> <b>Date de naissance:</b>  " + moment(req.body.dateNaiss).format('DD/MM/YYYY') +
				"<br> <b>Lieu de naissace:</b>  " + req.body.lieuNaiss + "</p>"
		});
		newNotif.save();
		res.send(employeur);
	});
});
Router.delete('/employeur', function (req, res, next) {
	var offresIDs = [];
	var contratsIDs = [];
	console.log(req.body)
	Offre.deleteMany({
		employeur: req.body._id
	}, function (err, offres) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		Contrat.deleteMany({
			employeur: req.body._id
		}, function (err, contrats) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			Demande.deleteMany({
				"profil.ID": req.body._id
			}, function (err, demandes) {
				if (err) {
					console.log(err.stack)
					return next(err);
				}
				Employeur.findByIdAndRemove(req.body._id, function (err, employeur) {
					if (err) {
						console.log(err.stack)
						return next(err);
					}
					User.findByIdAndRemove(employeur.userID, function (err, user) {
						if (err) {
							console.log(err.stack)
							return next(err);
						}
						res.send({
							'user': user,
							'employeur': employeur,
							'offres': offres,
							'contrats': contrats,
							'demandes': demandes
						});
					});
				});
			});
		});
	});
});

// Offre RUD
Router.get('/offres', function (req, res, next) {
	Offre.find().populate('employeur postulants competence').exec(function (err, offres) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(offres);
	});
});
Router.put('/offre', function (req, res, next) {
	Offre.findByIdAndUpdate(req.body._id, {
		$set: {
			titre: req.body.titre,
			description: req.body.description
		}
	}).exec(function (err, offre) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		User.findOne({
			"profil.ID": offre.employeur
		}, function (err, user) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			var newNotif = new Notification({
				userID: user._id,
				titre: "Votre offre " + offre._id + " a été modifiée.",
				contenu: "Un administrateur vient de modifier l'une de vos offres.",
				target: {
					targetType: 'Offre',
					targetPath: offre._id
				}
			});
			newNotif.save();
			res.send(offre)
		})
	})
});
Router.delete('/offre', function (req, res, next) {
	Contrat.remove({
		offre: req.body._id
	}, function (err, contrat) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		Offre.findByIdAndRemove(req.body._id, function (err, offre) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			User.findOne({
				"profil.ID": offre.employeur
			}, function (err, user) {
				if (err) {
					console.log(err.stack)
					return next(err);
				}
				var newNotif = new Notification({
					userID: user._id,
					titre: "Votre offre " + offre._id + " a été supprimée.",
					contenu: "Un administrateur vient de supprimer l'une de vos offres, intitulée: " + offre.titre + ".",
				});
				newNotif.save();
				res.send({
					offre: offre,
					contrat: contrat
				})
			})
		})
	})

});

// Demande RUD
Router.get('/demandes', function (req, res, next) {
	Demande.find().populate('profil.ID justificatifs.competence').sort({
		dateCreated: -1
	}).exec(function (err, demandes) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(demandes);
	})
});
Router.put('/demande', function (req, res, next) {
	Demande.findByIdAndUpdate(req.body._id, {
		$set: {
			status: 'processed',
			dateTreated: new Date()
		}
	}, function (err, demande) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		console.log(demande.profil.accountType);
		if (demande.profil.accountType === 'Employeur') {
			Employeur.findByIdAndUpdate(demande.profil.ID, {
				isValid: true
			}, function (err, employeur) {
				if (err) {
					console.log(err.stack)
					return next(err);
				}
				var newNotif = new Notification({
					userID: employeur.userID,
					titre: "Votre profil a été validé par un administrateur.",
					contenu: "Un administrateur vient de vérifier votre demande de validation et l'a validée.",
				});
				newNotif.save();
				res.send({
					demande: demande,
					user: employeur
				})
			})
		} else if (demande.profil.accountType === 'Freelancer') {
			Freelancer.findByIdAndUpdate(demande.profil.ID, {
				isValid: true
			}, function (err, freelancer) {
				if (err) {
					console.log(err.stack)
					return next(err);
				}
				var newNotif = new Notification({
					userID: freelancer.userID,
					titre: "Votre profil a été validé par un administrateur.",
					contenu: "Un administrateur vient de vérifier votre demande de validation et l'a validée.",
				});
				newNotif.save();
				res.send({
					demande: demande,
					user: freelancer
				})
			})
		}
	})
});
Router.delete('/demande', function (req, res, next) {
	Demande.findByIdAndRemove(req.body._id, function (err, demande) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		User.findOne({
			"profil.ID": demande.profil.ID
		}, function (err, user) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			var newNotif = new Notification({
				userID: user._id,
				titre: "Votre demande de validation a été refusée.",
				contenu: "Un administrateur vient de refuser votre demande de validation.",
			});
			newNotif.save();
			res.send(demande);
		})

	})
});

//Messages CRUD
Router.get('/messages', function (req, res, next) {
	Message.count({
		destinataire: req.user._id
	}, function (err, destCount) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		Message.count({
			expediteur: req.user._id
		}, function (err, expCount) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			Message.count({
				destinataire: req.user._id,
				lu: false
			}, function (err, unreadCount) {
				if (err) {
					console.log(err.stack)
					return next(err);
				}
				res.send({
					received: destCount,
					sent: expCount,
					unread: unreadCount
				})
			})
		})
	})
});
Router.get('/messages/recus', function (req, res, next) {
	Message.find({
		destinataire: req.user._id
	}).sort({
		dateCreated: -1
	}).populate('expediteur destinataire').populate({
		path: 'expediteur',
		populate: {
			path: 'profil.ID'
		}
	}).populate({
		path: 'destinataire',
		populate: {
			path: 'profil.ID'
		}
	}).exec(function (err, messages) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(messages)
	})
});

Router.get('/messages/envoyes', function (req, res, next) {
	Message.find({
		expediteur: req.user._id
	}).sort({
		dateCreated: -1
	}).populate('expediteur destinataire').populate({
		path: 'expediteur',
		populate: {
			path: 'profil.ID'
		}
	}).populate({
		path: 'destinataire',
		populate: {
			path: 'profil.ID'
		}
	}).exec(function (err, messages) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(messages)
	})
});

Router.put('/messages', function (req, res, next) {
	Message.findByIdAndUpdate(req.body._id, {
		$set: {
			lu: true
		}
	}, function (err, message) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(message)
	})
})

Router.delete('/messages', function (req, res, next) {
	Message.findByIdAndRemove(req.body._id, function (err, message) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(message)
	})
})

Router.post('/messages', function (req, res, next) {
	newMessage = new Message({
		objet: req.body.objet,
		contenu: req.body.contenu,
		expediteur: req.user._id,
		destinataire: req.body.dest
	})
	newMessage.save(function (err, message) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send('Message enregistré');
	})
})

//Notifications RUD

Router.get('/notifications', function (req, res, next) {
	Notification.count({
		userID: req.user._id,
		lu: false
	}, function (err, unreadCount) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		Notification.count({
			userID: req.user._id,
			lu: true
		}, function (err, readCount) {
			if (err) {
				console.log(err.stack)
				return next(err);
			}
			res.send({
				unread: unreadCount,
				read: readCount
			})
		})
	})

});

Router.get('/notifications/unread', function (req, res, next) {
	Notification.find({
		userID: req.user._id,
		lu: false
	}).sort({
		date_ajout: -1
	}).exec(function (err, unreadNotifs) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(unreadNotifs)
	})

});
Router.get('/notifications/read', function (req, res, next) {
	Notification.find({
		userID: req.user._id,
		lu: true
	}).sort({
		date_lu: -1
	}).exec(function (err, readNotifs) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(readNotifs)
	})

});
Router.put('/notifications', function (req, res, next) {
	Notification.findByIdAndUpdate(req.body._id, {
		$set: {
			lu: true,
			date_lu: new Date()
		}
	}, function (err, notif) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(notif)
	})

});
Router.delete('/notifications', function (req, res, next) {
	Notification.findByIdAndRemove(req.body._id, function (err, notif) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(notif)
	})

});

//
Router.get('/users', function (req, res, next) {
	User.find({
		_id: {
			$ne: req.user._id
		}
	}).populate('profil.ID').exec(function (err, users) {
		if (err) {
			console.log(err.stack)
			return next(err);
		}
		res.send(users);
	})
})
module.exports = Router;