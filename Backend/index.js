const express = require('express');
    const bodyParser = require('body-parser');
    const verifyWebhook = require('./verify-webhook');
    require('dotenv').config({ path: 'variables.env' });
    const app = express();

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.get('/', verifyWebhook);

    app.listen(5000, () => console.log('Express server is listening on port 5000'));