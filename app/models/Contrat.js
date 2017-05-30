var mongoose = require('mongoose');
var shortid = require('shortid');

var contratSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    employeur: {
        type: String,
        ref: 'Employeur'
    },
    freelancer: {
        type: String,
        ref: 'Freelancer'
    },
    offre: {
        type: String,
        ref: 'Offre'
    },
    dateDebut: {
        type: Date,
        default: Date.now()
    },
    dateFin: Date,
    etat: {
        type: String,
        default: 'Négociation'
    }
});

var Contrat = mongoose.model('Contrat', contratSchema);

module.exports = Contrat;