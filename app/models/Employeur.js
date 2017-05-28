var mongoose = require('mongoose');
var shortid = require('shortid');

var employeurSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    userID: {
        type: String,
        ref: 'User'
    },
    nom: String,
    pnom: String,
    nomEntreprise: {
        type: String,
        default: 'Travail à son compte'
    },
    sexe: String,
    dateNaiss: Date,
    lieuNaiss: String,
    wilayaAdr: String,
    communeAdr: String,
    quartierAdr: String,
    lotissementAdr: String,
    email: String,
    telephone: String,
    lastModified: Date,
    domaines: [{
        type: String,
        ref: 'Domaine'
    }],
    notations: [{
        note: Number,
        freelancer: {
            type: String,
            ref: 'Freelancer',
        },
        contrat: {
            type: String,
            ref: 'contrat'
        }
    }],
    isValid: {
        type: Boolean,
        default: false
    },
    visibilite: {
        type: Boolean,
        default: false
    }
});

var Employeur = mongoose.model('Employeur', employeurSchema);

module.exports = Employeur;