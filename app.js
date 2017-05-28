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
});