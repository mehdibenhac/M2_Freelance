var Middleware = {
    isFreelancer: function (req, res, next) {
        if (req.user.accountType === "Freelancer") {
            return next();
        } else if (req.user.accountType === "Employeur") {
            req.flash('employeurConnected', 'Vous ne pouvez pas acceder à cette partie du site.');
            return res.redirect("/employeur")
        }
        res.redirect('/login')
    },
    isEmployeur: function (req, res, next) {
        if (req.user.accountType === "Employeur") {
            return next();
        } else if (req.user.accountType === "Freelancer") {
            req.flash('freelancerConnected', 'Vous ne pouvez pas acceder à cette partie du site.');
            return res.redirect("/freelancer")
        }
        res.redirect('/login')
    },
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/login');
        }
    },
    isNotLoggedIn: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else if (req.isAuthenticated() && req.user.accountType === "Freelancer") {
            req.flash('freelancerConnected', 'Vous étes deja connecté en tant que freelancer');
            return res.redirect('/freelancer');
        } else if (req.isAuthenticated() && req.user.accountType === "Employeur") {
            req.flash('employeurConnected', 'Vous étes deja connecté en tant qu\'employeur');
            return res.redirect('/employeur');
        }
        res.send('Already logged in!')
    }
}
module.exports = Middleware;