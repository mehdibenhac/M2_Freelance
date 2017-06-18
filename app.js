//---------------- Requires

var app = require('express')();

require("./app/config.js")(app);
require("./app/routes.js")(app);
require("./app/db.js")();


//---------------- Error Handling


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.stack);
    res.send({
        message: "Une erreur est survenue!",
        error: {
            status: err.status,
            error: err.message,
        }
    })
})

app.all('*', function (req, res, next) {
    res.status(404);
    res.send('404: File not found!');
});

//---------------- Server

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Serveur démarré sur le port: " + PORT);
    console.log("Ouvrez votre navigateur et rendez-vous à l\'adresse: http://localhost:" + PORT + "/");
    console.log("Si une erreur se produit, tapez 'rs' dans votre terminal pour relancer le serveur.");
    console.log("Si une erreur de type EARRDINUSE survient, c'est qu'un autre programme occupe dèja le port " + PORT + ".");
});