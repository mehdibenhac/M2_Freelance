var Router = require('express').Router();
var Competence = require('../models/Competence.js');
var Domaine = require('../models/Domaine.js');

//------- GET ALL Competences
Router.get('/all', function (req, res) {
    Competence.find(function (err, competences, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).json({
                httpErr: '500',
                message: 'Error! check server console for logs.'
            });
            next();
        }
        if (competences.length === 0) {
            res.status(404).json({
                httpErr: '404',
                message: 'No competences found.'
            });
        } else {
            res.status(200).json({
                message: 'Competences found!',
                competences: competences
            });
        }
    });
});

//------- GET ONE DOMAINE BY ID
Router.get('/:id', function (req, res) {
    var ID = req.params.id;
    Competence.findById(ID, function (err, competence, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).json({
                httpErr: '500',
                message: 'Error! check server console for logs.'
            });
            next();
        }
        if (competence.length === 0) {
            res.status(404).json({
                httpErr: '404',
                message: 'No competence found with provided ID.'
            });
        } else {
            res.status(200).json({
                message: 'Competence found!',
                competence: competence
            });
        }
    });
});
Router.get('/', function (req, res) {
    Domaine.find().select('_id titre').exec(function (err, domaines, next) {
        if (err) {
            console.log(err.stack);
            res.status(500).send('Erreur! consultez votre console!');
            return next();
        }
        res.render('utility/competences', {
            domaines: domaines
        });

    });
})
//------- ADD NEW Competence
Router.post('/', function (req, res, next) {
    console.log(req.body.domaines);
    var newCompetence = new Competence({
        titre: req.body.competTitre,
        description: req.body.competDesc,
        domaine: req.body.domaines
    });
    console.log(newCompetence);
    newCompetence.save(function (err, results) {
        if (err) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
        }
        res.status(200).json({
            message: 'Competence created!',
            competence: results
        });
    });

})

module.exports = Router;