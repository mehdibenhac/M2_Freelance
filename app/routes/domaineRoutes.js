var Router = require('express').Router();
var Domaine = require('../models/Domaine.js');
var Competence = require('../models/Competence.js');

//------- GET ALL DOMAINES
Router.get('/all', function (req, res) {
    Domaine.find(function (err, domaines, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).json({
                httpErr: '500',
                message: 'Error! check server console for logs.'
            });
            next();
        }
        if (domaines.length === 0) {
            res.status(404).json({
                httpErr: '404',
                message: 'No domaines found.'
            });
        } else {
            res.status(200).json({
                message: 'Domaines found!',
                domaines: domaines
            });
        }
    });
});

//------- GET ONE DOMAINE BY ID
Router.get('/:id', function (req, res) {
    var ID = req.params.id;
    Domaine.findById(ID, function (err, domaine, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).json({
                httpErr: '500',
                message: 'Error! check server console for logs.'
            });
            next();
        }
        if (domaine === null) {
            res.status(404).json({
                httpErr: '404',
                message: 'No domaine found with provided ID.'
            });
        } else {
            res.status(200).json({
                message: 'Domaine found!',
                domaine: domaine
            });
        }
    });
});
Router.get('/', function (req, res) {
    res.render('utility/domaines');
});
//------- ADD NEW DOMAINE
Router.post('/', function (req, res) {
    var newDomaine = new Domaine({
        titre: req.body.domaineTitre,
        description: req.body.domaineDesc
    });
    newDomaine.save(function (err, createdDomaine, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).json({
                httpErr: '500',
                message: 'Error! check server console for logs.'
            });
            next();
        }
        res.status(200).json({
            message: 'Domaine created!',
            domaine: createdDomaine
        });
    });

});

//------- Check competences of a domaine by its ID
Router.get('/:id/competences', function (req, res) {
    var ID = req.params.id;
    Competence.find({
        domaine: ID
    }, function (err, listeCompetences, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).json({
                httpErr: '500',
                message: 'Error! check server console for logs.'
            });
            next();
        }
        if (listeCompetences.length === 0) {
            res.status(404).json({
                httpErr: '404',
                message: 'No competences found with provided domaine ID.'
            });
        } else {
            res.status(200).json({
                message: 'Competences found!',
                competences: listeCompetences
            });
        }
    })
});

module.exports = Router;