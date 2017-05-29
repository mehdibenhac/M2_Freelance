var mongoose = require('mongoose');
var shortid = require('shortid');

var offreSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    titre: String,
    description: String,
    competence: {
        type: String,
        ref: 'Competence'
    },
    localisation: String,
    employeur: {
        type: String,
        ref: 'Employeur'
    },
    postulants: [{
        type: String,
        ref: 'Freelancer'
    }],
    url_conditions: String,
    url_autre: String,
    dateAjout: {
        type: Date,
        default: Date.now()
    },
    duree_min: Number,
    duree_max: Number,
    etat: {
        type: String,
        default: 'Ouverte'
    }
});

var Offre = mongoose.model('Offre', offreSchema);

module.exports = Offre;