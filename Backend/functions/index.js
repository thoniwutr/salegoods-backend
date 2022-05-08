const functions = require("firebase-functions");
const express = require('express');
    const bodyParser = require('body-parser');
    const verifyWebhook = require('./verify-webhook');
    //require('dotenv').config({ path: './variables.env' });
    const messageWebhook = require('./message-webhook');
	//const facebooklive = require('./facebooklive');
    const app = express();
	
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    
    app.get('/', verifyWebhook);
    app.get('/help', (req,res)=>{
		res.send("OK");
	});
    app.post('/', messageWebhook);

    app.listen(5001, () => console.log('Express server is listening on port 5001'));
exports.app = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
