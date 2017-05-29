var mongoose = require('mongoose');
var shortid = require('shortid');

var demandeSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    profil: {
        accountType: String,
        ID: {
            type: String,
            refPath: 'profil.accountType'
        }
    },
    justificatifs: [{
        url: String,
        competence: {
            type: String,
            ref: 'Competence'
        },
        date_ajout: {
            type: Date,
            default: Date.now()
        }
    }],
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    dateTreated: Date,
    status: String
});

var Demande = mongoose.model('Demande', demandeSchema);

module.exports = Demande;