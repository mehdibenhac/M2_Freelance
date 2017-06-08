var Notification = require('./models/Notification.js');

var Utility = {
    notifyOffre: function (targets, offre) {
        switch (Array.isArray(targets)) {
            case true:
                targets.forEach(function (target) {
                    var newNotif = new Notification({
                        userID: target,
                        titre: "Vous avez reçu une nouvelle notification concernant l'offre: " + offre,
                        contenu: "Une nouvelle offre correspondant à vos compétences est disponible.",
                        target: {
                            targetType: 'Offre',
                            targetPath: offre
                        }
                    });
                    newNotif.save(function (err, notif) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        console.log('Nouvelle notification ajoutée pour l\'offre: ' + offre + ' Utilisateur: ' + target);
                    });
                });
                break;
            case false:
                var newNotif = new Notification({
                    userID: targets,
                    titre: "Vous avez reçu une nouvelle notification concernant l'offre: " + offre,
                    contenu: "Une nouvelle offre correspondant à vos compétences est disponible.",
                    target: {
                        targetType: 'Offre',
                        targetPath: offre
                    }
                });
                newNotif.save(function (err, notif) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('Nouvelle notification ajoutée pour l\'offre: ' + offre);
                });
                break;
        }
    },
    notifyModOffre: function (targets, offre) {
        switch (Array.isArray(targets)) {
            case true:
                targets.forEach(function (target) {
                    var newNotif = new Notification({
                        userID: target,
                        titre: "Vous avez reçu une nouvelle notification concernant l'offre: " + offre,
                        contenu: "Une offre à laquelle vous aviez postulé a été modifiée.",
                        target: {
                            targetType: 'Offre',
                            targetPath: offre
                        }
                    });
                    newNotif.save(function (err, notif) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        console.log('Nouvelle notification ajoutée pour l\'offre: ' + offre + ' Utilisateur: ' + target);
                    });
                });
                break;
            case false:
                var newNotif = new Notification({
                    userID: targets,
                    titre: "Vous avez reçu une nouvelle notification concernant l'offre: " + offre,
                    contenu: "Une offre à laquelle vous aviez postulé a été modifiée.",
                    target: {
                        targetType: 'Offre',
                        targetPath: offre
                    }
                });
                newNotif.save(function (err, notif) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    console.log('Nouvelle notification ajoutée pour l\'offre: ' + offre);
                });
                break;
        }
    },
    notifyPostulat: function (target, offre) {
        var newNotif = new Notification({
            userID: target,
            titre: "Vous avez reçu une nouvelle notification concernant l'offre: " + offre,
            contenu: "Un freelancer vient de postulaer pour l'une de vos offres.",
            target: {
                targetType: 'Offre',
                targetPath: offre
            }
        });
        newNotif.save(function (err, notif) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            console.log('Nouvelle notification ajoutée pour l\'offre: ' + offre + ' Utilisateur: ' + target);
        });
    },
    notifyContratEmp: function (target, contrat) {
        var newNotif = new Notification({
            userID: target,
            titre: "Vous avez reçu une nouvelle notification concernant le contrat: " + contrat,
            contenu: "Un Freelancer vient d'accepter les termes de l'un de vos contrats.",
            target: {
                targetType: 'Contrat',
                targetPath: contrat
            }
        });
        newNotif.save(function (err, notif) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            console.log('Nouvelle notification ajoutée pour le contrat: ' + contrat + ' Employeur: ' + target);
        })
    },
    notifyContratFree: function (target, contrat) {
        var newNotif = new Notification({
            userID: target,
            titre: "Vous avez reçu une nouvelle notification concernant le contrat: " + contrat,
            contenu: "Un employeur vient d'accepter votre postulation et vous a proposé un contrat.",
            target: {
                targetType: 'Contrat',
                targetPath: contrat
            }
        });
        newNotif.save(function (err, notif) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            console.log('Nouvelle notification ajoutée pour le contrat: ' + contrat + ' Freelancer: ' + target);
        })
    },


}

module.exports = Utility;