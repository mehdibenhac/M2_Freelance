var mongoose = require('mongoose');
var shortid = require('shortid');

var notificationSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    userID: {
        type: String,
        ref: 'User'
    },
    titre: String,
    contenu: String,
    idOffre: {
        type: String,
        ref: 'Offre'
    },
    lu: {
        type: Boolean,
        default: false
    },
    date_ajout: {
        type: Date,
        default: Date.now()
    },
    date_lu: Date
});
var Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;