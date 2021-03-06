var express = require("express");
var app = express();
var chatbot = require('./config/bot.js');

var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())




// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});




/**
 * Endpoint to get a JSON object of watson converation response
 * REST API example:
 * <code>
 * POST https://whatsound-conversation.mybluemix.net/
 * </code>
 * Sending a JSON Object having context object and text, to 
 * continue Watson Conversation's chat
 *
 * Response:
 * [ text = [{"Ola"}], context : { } ]
 * @return An object of all the conversation params
 */





app.post("/", function (req, res) {
    
    
    var params = req.body || null;
    
    if (Object.keys(params).length != 0 ) {
        processChatMessage(req, res);
    } else {
        res.status(400).json({
            error: "true"
        });
    }
});

function processChatMessage(req, res) {
    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log('Error in sending message: ', err);
            res.status(err.code || 500).json(err);
        } else {
            var context = data.context;
            res.status(200).json(data);
        }
    })
}





//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));



var port = process.env.PORT || 5000
app.listen(port, function () {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
