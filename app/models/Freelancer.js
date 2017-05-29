var mongoose = require('mongoose');
var shortid = require('shortid');

var freelancerSchema = mongoose.Schema({
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
    sexe: String,
    dateNaiss: Date,
    lieuNaiss: String,
    wilayaAdr: String,
    communeAdr: String,
    quartierAdr: String,
    lotissementAdr: String,
    email: String,
    telephone: String,
    isValid: {
        type: Boolean,
        default: false
    },
    competences: [{
        type: String,
        ref: 'Competence'
    }],
    notations: [{
        note: Number,
        employeur: {
            type: String,
            ref: 'Employeur',
        },
        contrat: {
            type: String,
            ref: 'contrat'
        }
    }],
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    lastModified: Date,
    parametres: {
        disponibilite: {
            type: Boolean,
            default: false
        },
        notif_offres: {
            type: Boolean,
            default: false
        }
    }
});

var Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;