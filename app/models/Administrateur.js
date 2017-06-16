var mongoose = require('mongoose');
var shortid = require('shortid');

var administrateurSchema = mongoose.Schema({
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
    email: String,
    telephone: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    },
});


var Administrateur = mongoose.model('Administrateur', administrateurSchema);

module.exports = Administrateur;