//---------------- Routes
module.exports = function (app) {
    // =====================
    //     ROUTES IMPORTS
    // =====================
    var indexRoutes = require('./routes/indexRoutes.js');
    // Freelancer Routes
    var freelancerIndex = require('./routes/freelancer/indexRoutes.js');
    var freelancerSignup = require('./routes/freelancer/signupRoutes.js');
    var freelancerModifier = require('./routes/freelancer/modifierRoutes.js');
    var freelancerDemande = require('./routes/freelancer/demandeRoutes.js');
    var freelancerOffres = require('./routes/freelancer/offresRoutes.js');
    var freelancerPostulats = require('./routes/freelancer/postulatsRoutes.js');
    var freelancerContrats = require('./routes/freelancer/contratsRoutes.js');
    var freelancerEmployeurs = require('./routes/freelancer/employeurRoutes.js');
    // Employeur Routes
    var employeurIndex = require('./routes/employeur/indexRoutes.js');
    var employeurSignup = require('./routes/employeur/signupRoutes.js');
    var employeurModifier = require('./routes/employeur/modifierRoutes.js');
    var employeurOffres = require('./routes/employeur/offresRoutes.js');
    var employeurPostulats = require('./routes/employeur/postulatsRoutes.js');
    var employeurContrats = require('./routes/employeur/contratsRoutes.js');
    var employeurFreelancers = require('./routes/employeur/freelancersRoutes.js');

    // Other Routes
    var domaineRoutes = require('./routes/domaineRoutes.js');
    var competenceRoutes = require('./routes/competenceRoutes.js');
    var messagerieRoutes = require('./routes/messagerieRoutes.js');
    var notifsRoutes = require('./routes/notifsRoutes.js');
    var endpointsRoutes = require('./routes/endpoints.js');
    var testRoutes = require('./routes/testRoutes.js');

    // =====================
    //        APP.USE
    // =====================

    // Freelancer
    app.use('/freelancer', freelancerIndex);
    app.use('/freelancer/signup', freelancerSignup);
    app.use('/freelancer/modifier', freelancerModifier);
    app.use('/freelancer/offres', freelancerOffres);
    app.use('/freelancer/demande', freelancerDemande);
    app.use('/freelancer/postulats', freelancerPostulats);
    app.use('/freelancer/contrats', freelancerContrats);
    app.use('/freelancer/employeurs', freelancerEmployeurs);
    // Employeur
    app.use('/employeur', employeurIndex);
    app.use('/employeur/modifier', employeurModifier);
    app.use('/employeur/signup', employeurSignup);
    app.use('/employeur/postulats', employeurPostulats);
    app.use('/employeur/offres', employeurOffres);
    app.use('/employeur/contrats', employeurContrats);
    app.use('/employeur/freelancers', employeurFreelancers);
    // Others
    app.use('/competences', competenceRoutes);
    app.use('/endpoints', endpointsRoutes);
    app.use('/domaines', domaineRoutes);
    app.use('/messagerie', messagerieRoutes);
    app.use('/notifications', notifsRoutes);
    app.use('/test', testRoutes);
    app.use('/', indexRoutes);
}