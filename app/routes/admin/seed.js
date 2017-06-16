var Router = require('express').Router();
var User = require('../../models/User.js');
var Freelancer = require('../../models/Freelancer.js');
var Employeur = require('../../models/Employeur.js');
var Competence = require('../../models/Competence.js');
var Offre = require('../../models/Offre.js');
var Demande = require('../../models/Demande.js');
var shortid = require('shortid');

var noms = [
    'Bendali', 'Bent', 'Boulghoul', 'Kemmoukh', 'Benmekhbi', 'Douas', 'Benameur', 'Bouameur', 'Bouchham', 'Dhili',
    'Bitat', 'Meharzi', 'Nacer', 'Boudeloui', 'Bouteflika', 'Zein', 'Salem', 'Guidouche', 'Debbache', 'Hacine',
    'Boulefkhaad', 'Basem', 'Djennidi', 'Darouas', 'Faleh', 'Fellah', 'Khaled'
];
var mPnoms = ['Mehdi', 'Mohammed', 'Anis', 'Maisser', 'Omar', 'Chakib', 'Djalal', 'Moad', 'Sami', 'Amir',
    'Imad', 'Sadek', 'Ala', 'Chouaib', 'Nadjib', 'Tewfik', 'Ammar', 'Hakim', 'Nabil', 'Bilal', 'Abdullah'
];
var entNoms = ['Nour Ets.', 'Behdja Inc.', 'Amrouch SARL.', 'Baraka EURL.', 'Nedjma Ets.', 'Bladi SARL.', 'Amine EURL.', 'Nouara SARL.'];
var wilayas = ['Annaba', 'Alger', 'Adrar', 'Constantine', 'Oran', 'Bechar', 'Mila', 'Skikda', 'Bejaia'];
var communes = ['Didouche mourad', 'Hamma Bouziane', 'Zighoud Youcef', 'Sidi Yahia', 'Amer Kitoche', 'Si Malek El-Amroch'];
var quartiers = ['Belle Vue', '1er Novembre 1954', 'Les Faillettes', 'Les Fleurettes', 'Esplanades', '400 logements', 'El-Hamrouch',
    'Sonatiba', 'Siloc', 'Ouedi-Rhimel', 'Oued lehdjar'
];
var competences = ['BJlLcafWb', 'r1LP9TMbb', 'HkGT5aMbb', 'Bkgyspzbb', 'ry8vEHpMW'];
var domaines = ['Skw7IpMWb', 'S1DsPTGW-', 'SJhpw6fZ-', 'HyT-5Tf-Z'];
var usernames = ['hreen1', 'hreen2', 'hreen3', 'hreen4', 'hreen5', 'hreen6', 'hreen7', 'hreen8', 'hreen9', 'hreen10', 'hreen11']

var titre1 = ['Recherche', 'A besoin de', 'Nécessite', 'Demande', 'Cherche', 'Requiert', 'Veut trouver'];
var titre2 = ['quelqu\'un de compétant', 'personnel qualifié'];
var titre3 = ['pour répondre à mes besoins.', 'pour réaliser mes attentes', 'pour résoudre un problème'];


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// function randomEmp(emps) {
//     var IDS = [];
//     emps.forEach(function(emp) {
//         return 
//     });
// }

function randomNumber(Max) {
    return Math.floor(Math.random() * Max)
}

function randomCompets(compets) {
    var rand1 = 0;
    var rand2 = 0;
    var randCompets = []
    while (rand1 === rand2) {
        rand1 = Math.floor(Math.random() * compets.length);
        rand2 = Math.floor(Math.random() * compets.length);
    }
    randCompets.push(compets[rand1]);
    randCompets.push(compets[rand2]);
    return randCompets;
}

function randomPhone() {
    return '0' + Math.floor(Math.random() * (699999999 - 640000000 + 1) + 640000000);
}

Router.post('/freelancer', function (req, res, next) {
    var password = 'dundee07';
    var newUser = new User({
        username: shortid.generate()
    });
    var newFreelancer = new Freelancer({
        nom: randomItem(noms),
        pnom: randomItem(mPnoms),
        userID: newUser._id,
        sexe: 'Homme',
        dateNaiss: randomDate(new Date(1958, 05, 15), new Date(1997, 02, 20)),
        lieuNaiss: randomItem(wilayas),
        wilayaAdr: randomItem(wilayas),
        communeAdr: randomItem(communes),
        quartierAdr: randomItem(quartiers),
        lotissementAdr: randomNumber(2000),
        telephone: randomPhone(),
        competences: randomCompets(competences)
    });
    var randEmail = newFreelancer.nom + '.' + newFreelancer.pnom + '.' + (Math.floor(Math.random() * 999) + 1) + '@gmail.com';
    newFreelancer.email = randEmail;
    newUser.profil = {
        accountType: "Freelancer",
        ID: newFreelancer._id
    };
    newFreelancer.save(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        User.register(newUser, password, function (err, user) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send({
                message: 'Utilisateur ' + user.username + ' Créé avec succés!',
                user: user,
                freelancer: freelancer
            })
        });
    });
});
Router.post('/employeur', function (req, res, next) {
    var password = 'dundee07';
    var newUser = new User({
        username: shortid.generate()
    });
    var newEmployeur = new Employeur({
        nom: randomItem(noms),
        pnom: randomItem(mPnoms),
        userID: newUser._id,
        sexe: 'Homme',
        dateNaiss: randomDate(new Date(1958, 05, 15), new Date(1997, 02, 20)),
        lieuNaiss: randomItem(wilayas),
        wilayaAdr: randomItem(wilayas),
        communeAdr: randomItem(communes),
        quartierAdr: randomItem(quartiers),
        lotissementAdr: randomNumber(2000),
        telephone: randomPhone(),
        domaines: randomCompets(domaines)
    });
    var randEmail = newEmployeur.nom + '.' + newEmployeur.pnom + '.' + (Math.floor(Math.random() * 999) + 1) + '@gmail.com';
    newEmployeur.email = randEmail;
    newEmployeur.nomEntreprise = newEmployeur.nom + ' SARL';
    newUser.profil = {
        accountType: "Employeur",
        ID: newEmployeur._id
    };
    var newDemande = new Demande({
        profil: {
            accountType: "Employeur",
            ID: newEmployeur._id
        },
        status: 'pending'
    });
    newDemande.save(function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        newEmployeur.save(function (err, employeur) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            User.register(newUser, password, function (err, user) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.send({
                    message: 'Utilisateur ' + user.username + ' Créé avec succés!',
                    user: user,
                    employeur: employeur,
                    demande: demande
                })
            });
        });
    });

});
Router.post('/offre', function (req, res, next) {
    Employeur.find().select('_id').exec(function (err, employeurs) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        randomEmp = employeurs[Math.floor(Math.random() * employeurs.length)]._id;
        Competence.find().select('_id').exec(function (err, competences) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            randomComp = competences[Math.floor(Math.random() * competences.length)]._id;
            var newOffre = new Offre({
                titre: randomItem(titre1) + ' ' + randomItem(titre2) + ' ' + randomItem(titre3),
                description: 'Cherche quelqu\'un de qualifié pour répondre à un besoin urgent. Pour plus de détails veuillez me contacter directement.',
                competence: randomComp,
                localisation: 'Nationale',
                employeur: randomEmp,
                duree_min: 10,
                duree_max: 30,
                url_conditions: '/static/uploads/dummy.pdf',
            });
            newOffre.save(function (err, offre) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.send({
                    message: 'Nouvelle offre créée!',
                    offre: offre
                })
            })
        });

    })
});
module.exports = Router;