var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
var routes = require("./routes/routes.js")(app);
 
var server = app.listen(process.env.PORT || 5000, function () {
    console.log("Listening on port %s...", server.address().port);
});