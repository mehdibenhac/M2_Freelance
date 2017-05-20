var mongoose = require('mongoose');
var shortid = require('shortid');

var freelancerSchema = mongoose.Schema({
    /* _id: {
         type: String,
         default: shortid.generate
     },
     contenu: String,
     dateCreation: {
         type: Date,
         default: Date.now()
     },
     dateModification: {
         type: Date,
         default: null
     },
     notes: [{
         type: String,
         ref: 'Note'
     }],
     patient: [{
         type: String,
         ref: 'Patient'
     }]*/
});

var Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;