//---------------- Routes
module.exports = function (app) {
    // =====================
    //     ROUTES IMPORTS
    // =====================
    var indexRoutes = require('./routes/indexRoutes.js');
    // Freelancer Routes
    var freelancerIndex = require('./routes/freelancer/indexRoutes.js');
    var freelancerSignup = require('./routes/freelancer/signupRoutes.js')
    var freelancerModifier = require('./routes/freelancer/modifierRoutes.js')
    var freelancerDemande = require('./routes/freelancer/demandeRoutes.js')
    // Employeur Routes
    var employeurIndex = require('./routes/employeur/indexRoutes.js');
    var employeurSignup = require('./routes/employeur/signupRoutes.js');

    // Other Routes
    var domaineRoutes = require('./routes/domaineRoutes.js');
    var competenceRoutes = require('./routes/competenceRoutes.js');
    var endpointsRoutes = require('./routes/endpoints.js');
    var testRoutes = require('./routes/testRoutes.js');

    // =====================
    //        APP.USE
    // =====================

    // Freelancer
    app.use('/freelancer', freelancerIndex);
    app.use('/freelancer/signup', freelancerSignup);
    app.use('/freelancer/modifier', freelancerModifier);
    app.use('/freelancer/demande', freelancerDemande);
    // Employeur
    app.use('/employeur', employeurIndex);
    app.use('/employeur/signup', employeurSignup);
    // Others
    app.use('/competences', competenceRoutes);
    app.use('/endpoints', endpointsRoutes);
    app.use('/domaines', domaineRoutes);
    app.use('/test', testRoutes);
    app.use('/', indexRoutes);
}