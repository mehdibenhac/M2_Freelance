var mongoose = require('mongoose');
var shortid = require('shortid');

var competenceSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    titre: String,
    description: String,
    domaine: {
        type: String,
        ref: 'Domaine'
    }
});

var Competence = mongoose.model('Competence', competenceSchema);

module.exports = Competence;