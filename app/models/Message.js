var mongoose = require('mongoose');
var shortid = require('shortid');

var messageSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    objet: String,
    contenu: String,
    expediteur: {
        type: String,
        ref: 'User'
    },
    destinataire: {
        type: String,
        ref: 'User'
    },
    lu: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    dateLu: Date
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;