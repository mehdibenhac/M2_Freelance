var mongoose = require('mongoose');
var shortid = require('shortid');

var demandeSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    userID: {
        type: String,
        ref: 'User'
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
    state: String
});

var Demande = mongoose.model('Demande', demandeSchema);

module.exports = Demande;