var Router = require('express').Router();
var User = require('../../models/User.js');
var Freelancer = require('../../models/Freelancer.js');
var Employeur = require('../../models/Employeur.js');
var Administrateur = require('../../models/Administrateur.js');
var Offre = require('../../models/Offre.js');
var Contrat = require('../../models/Contrat.js');
var Demande = require('../../models/Demande.js');
var passport = require('passport');

Router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,$");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, $");
	next();
});

Router.get('/', function (req, res, next) {
	res.send('Admin Index');
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
// Employeur CRUD
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

//Offre CRUD
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
		res.send(offre)
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
			res.send({
				offre: offre,
				contrat: contrat
			})
		})
	})

});
module.exports = Router;