var User = require('./app/models/User.js');
var Freelancer = require('./app/models/Freelancer.js');

var noms = [
    'Bendali', 'Bent', 'Boulghoul', 'Kemmoukh', 'Benmekhbi', 'Douas', 'Benameur', 'Bouameur', 'Bouchham', 'Dhili',
    'Bitat', 'Meharzi', 'Nacer', 'Boudeloui', 'Bouteflika', 'Zein', 'Salem', 'Guidouche', 'Debbache', 'Hacine',
    'Boulefkhaad', 'Basem', 'Djennidi', 'Darouas', 'Faleh', 'Fellah', 'Khaled'
];
var mPnoms = ['Mehdi', 'Mohammed', 'Anis', 'Maisser', 'Omar', 'Chakib', 'Djalal', 'Moad', 'Sami', 'Amir',
    'Imad', 'Sadek', 'Ala', 'Chouaib', 'Nadjib', 'Tewfik', 'Ammar', 'Hakim', 'Nabil', 'Bilal', 'Abdullah'
];
var fPnoms = ['Asma', 'Anissa', 'Houdna', 'Yousra', 'Amina', 'Kelthoum', 'Meriem', 'Nada', 'Amira', 'Selma', 'Maroua'];
var wilayas = ['Annaba', 'Alger', 'Adrar', 'Constantine', 'Oran', 'Bechar', 'Mila', 'Skikda', 'Bejaia'];
var communes = ['Didouche mourad', 'Hamma Bouziane', 'Zighoud Youcef', 'Sidi Yahia', 'Amer Kitoche', 'Si Malek El-Amroch'];
var quartiers = ['Belle Vue', '1er Novembre 1954', 'Les Faillettes', 'Les Fleurettes', 'Esplanades', '400 logements', 'El-Hamrouch',
    'Sonatiba', 'Siloc', 'Ouedi-Rhimel', 'Oued lehdjar'
];
var competences = ['BJlLcafWb', 'r1LP9TMbb', 'HkGT5aMbb', 'Bkgyspzbb', 'ry8vEHpMW'];
var usernames = ['hreen1', 'hreen2', 'hreen3', 'hreen4', 'hreen5', 'hreen6', 'hreen7', 'hreen8', 'hreen9', 'hreen10', 'hreen11']



function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

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

function generateFreelancer(limit) {

}

generateFreelancer(usernames);