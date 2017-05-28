var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var shortid = require('shortid');

var userSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    username: String,
    password: String,
    accountType: String,
    notifications: [{
        titre: String,
        contenu: String,
        lu: Boolean,
        date_ajout: {
            type: Date,
            default: Date.now()
        },
        date_lu: Date
    }],
    messages_envoyes: [{
        type: String,
        ref: 'Message'
    }],
    messages_recus: [{
        type: String,
        ref: 'Message'
    }],
    demandes: [{
        type: String,
        ref: 'Demande'
    }],
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

module.exports = User;