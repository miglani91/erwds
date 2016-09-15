var smtpConfig = {
    host: 'mail.comparebeforebook.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'contact@comparebeforebook.com',
        pass: 'km8wN?97'
    },
    tls: { rejectUnauthorized: false }
};
var api_key = "prtl6749387986743898559646983194";
var apiUrl = "http://partners.api.skyscanner.net/apiservices/";
var request = require("request");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(smtpConfig);
var appRouter = function (app) {
    app.post("/makepost", function (req, res) {
        var method_url = req.query.method_url;
        var url = apiUrl + method_url + "?" + "apiKey=" + api_key;
        for (var key in req.query) {
            if (key != 'method_url')
                url = url + "&" + key + "=" + req.query[key];
        }
        var body = req.body.data || {};
        body.apiKey = api_key;
        console.log(body);
        console.log(url);
        request.post({ url: url, form: body, headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" } }, function (error, response, body) {
            if (response.statusCode === 200 || response.statusCode === 201) {
                for (var key in response.headers) {
                    console.log(response.headers[key]);
                    res.set(key, response.headers[key]);
                }
                if (response.headers.location) {
                    res.set("Access-Control-Expose-Headers", "location");
                }
                return res.json(JSON.parse(response.body));
            } else {
                return res.status(response.statusCode).send({ 'message': response.statusMessage });
            }
        });
    });
    app.put("/makeput", function (req, res) {
        var method_url = req.query.method_url;
        var url = apiUrl + method_url + "?" + "apiKey=" + api_key;
        for (var key in req.query) {
            if (key != 'method_url')
                url = url + "&" + key + "=" + req.query[key];
        };
        var body = req.body.data || {};
        body.apiKey = api_key;
        request.put({ url: url, form: body, headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" } }, function (error, response, body) {
            if (response.statusCode === 200 || response.statusCode === 201) {
                for (var key in response.headers) {
                    console.log(response.headers[key]);
                    res.set(key, response.headers[key]);
                }
                if (response.headers.location) {
                    res.set("Access-Control-Expose-Headers", "location");
                }
                return res.json(JSON.parse(response.body));
            } else {
                return res.status(response.statusCode).send({ 'message': response.statusMessage });
            }
        });
    });
    app.get("/makeget", function (req, res) {
        var method_url = req.query.method_url;
        var url = apiUrl + method_url + "?" + "apiKey=" + api_key;
        for (var key in req.query) {
            if (key != 'method_url')
                url = url + "&" + key + "=" + req.query[key];
        }
        console.log(url);
        request.get(url, function (error, response, body) {
            if (response.statusCode === 200 || response.statusCode === 201) {
                return res.json(JSON.parse(body));
            } else {
                console.log(response);
                return res.status(response.statusCode).send({ 'message': response.statusMessage });
            }
        })
    });
    app.post("/sendEmail", function (req, res) {
        var email = req.body.email;
        var name = req.body.name;
        var subject = req.body.subject;
        var message = req.body.message;
        if (!(email && name && subject && message)) {
            return res.json({ sent: false, error: 'Mandatory Information missing' });
        }
        var totalMessage = "Hi, \n You have recieved a message from contact section.\n\n" + "\n\n" + "Name : " + name + " \nEmail Address : " + email + "\n\nMessage : " + message + "\n\n Thanks,";
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"' + name + '" <' + smtpConfig.auth.user + '>', // sender address
            to: smtpConfig.auth.user, // list of receivers
            subject: subject, // Subject line
            text: totalMessage, // plaintext body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ sent: false, error: error });
            }
            return res.json({ sent: true });
        });
    });
    app.post("/signup", function (req, res) {
        var email = req.body.email;
        var fname = req.body.firstname;
        var lname = req.body.lastname;
        var name = fname+' '+lname;
        if (!(email && name)) {
            return res.json({ sent: false, error: 'Mandatory Information missing' });
        }
        var totalMessage = "Hi, \n\n I want to signup for the newsletter.\n\n" + "\n\n" + "Name : " + name + " \nEmail Address : " + email + "\n\nThanks, ";
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"' + name + '" <' + smtpConfig.auth.user + '>', // sender address
            to: smtpConfig.auth.user, // list of receivers
            subject: 'Newsletter Signup', // Subject line
            text: totalMessage, // plaintext body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ sent: false, error: error });
            }
            return res.json({ sent: true });
        });
    });
}

module.exports = appRouter;