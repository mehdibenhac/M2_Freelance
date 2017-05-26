var mongoose = require('mongoose');
var shortid = require('shortid');

var domaineSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    titre: String,
    description: String
});

var Domaine = mongoose.model('Domaine', domaineSchema);

module.exports = Domaine;