const fetch = require('node-fetch')
//import fetch from 'node-fetch';
    // You can find your project ID in your Dialogflow agent settings
    const projectId = 'bsd-salegoods'; //https://dialogflow.com/docs/agents#settings
    const sessionId = '123456';
    //const languageCode = 'en-US';
    const languageCode = 'th-TH';
    const dialogflow = require('dialogflow');

    const config = {
      // credentials: {
      //   private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
      //   client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
      // }
      credentials: {
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCK/O6HEL7lefSU\nd/FLe1SFLGEq4A21bEdQhWUal3QLweGE1ZHL5v+DXsamlAFvgHQF5ydGkFxpA2Ek\nf2VTAiOswShnNScEqH2ZgRH/9lypD+rLVQGQ4CEDo0ua67sLToCPMBzBf5lEyL1t\nARXmbF6SVKsCAQ/EKDS5b6gb1c8SJ5XKR7P0KCXrhDI/KyVGpFxCyH+D2PjQpceE\nh6NGRRlYW/Q3HjkzQbVQrYA4GVU4JhKVIaqE4qwZxMdSjoxWGKRF8Tc5mpq7rd38\n0dURbuFBJJy3p3OHS8Qk4iClx84PHEv90JCQsSVnSTRCEsiDDrVPYu57bAmi54iE\ng79yG9RtAgMBAAECggEAJrOhk9iU339jHIh9l0AjW+XstKypBJC/FuveKFZuCOwW\n6Q8zRuzuz1zvwejKsYq6Q/6G0D5YjSFUxn327/NTjcJHht2lHMXyG3F2Wqj2SllV\nTwM/qWDPsJyi6+OiNNbKM5T5HOR0AFRJcvXvbDdW6jZLXAaBpmRvsgcmb4HM5Efa\nbmVhYHwOyw57nZAiPDD8dISzIa16USxHvKq9LBz30vM+slh4/0xeBDxMoK8qw9p4\nxa3iGFPVctvJEFAq8RNYN1MCoiNh0JOmW1sjqZnJb/H2AW+wUEitZClUVT5E1fVt\nnoZ+o4iDrgCMQ4lNqjfVC1oWXUOq+0Z0cnuw5o2G3QKBgQDDlvDfE9qs8hRvw/xu\nyKrOp51tRF5yXSn2xbid1RIs1YCPbwPtmJpnSyL9jQ87IO/qIZdiL+plpKd2JpWY\nMx7UOoy4czfLlt0ewj9oek+GSs5q3nS7DMKIClYVviX6xj5X2FCe8ktaqv7KMtNl\nyCGedVG3VegKwk3+7tWa8jZoCwKBgQC16pBO4YuHfe3AUfijGcEmnkfDh9dkSIyQ\n+VsGTMs6gkfoEB72PvXYFBHev83Uow4VtSQFN9zE5cyrlPhVNUdQb1cOjCs679MT\nm66XrKnXQWyDpB6tiX1/bVhes3eLF644xd5AvLlwW9uduV+Mpy54ipiI+1/iN/YH\nbqbmDoroZwKBgQDAqK7NXjY5wx8EVK4TxhASDaMRXZYW2tQaIvrOZXJIvWmsX7Mj\n1/zHoIhv7wHAwZnxK3N9oSsnQgA+bpVOXZSRgrbYfY3JOerHgJmK5WfuJUOcm1Gq\nalA4Rs4zDqFEmwAP8aDAYHR/dA4Tx+rZyD/tYSzEBZfS+UBwzHuV695RrwKBgQCT\nskrR0GsxaXuTjrn46hsY2J9ZUDv/bqu5tMpDdiv2Z/ornpMUyI9fjQPpPv7FalEw\nLK5/EhjLP+wJTtzEiYpJ8uvSotkic76DB/4bpRML8lFBHAnQSXW79LIvyTQAmQxZ\nicTl+JPydpH7H5tFHiMruRMY/Eaf62F0LVGSLTJ4dwKBgQCbgpyWJRaDzwzcpED2\nh5jd2Wv6KNlQNgxeqPnkrsCms/ISSJTcou2ij5iJ6vP3uf0mgpL8IjD9ciVLiHCQ\naxJKkB7h9IyRXFJBfY7X/WfgJnbWLg1ongzfeX2ZXBjCYdD4UldMYeV9QecbtiOu\n/cImXRQ6YiZDRBfYXzqGfdndpA==\n-----END PRIVATE KEY-----\n",
        // client_email: "poppurik@gmail.com"
         client_email: "masterbackend-701@bsd-salegoods.iam.gserviceaccount.com"
      }
    };

    const sessionClient = new dialogflow.SessionsClient(config);
      //console.log(sessionClient);
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    
    // Remember the Page Access Token you got from Facebook earlier?
    // Don't forget to add it to your `variables.env` file.
    // const { FACEBOOK_ACCESS_TOKEN } = process.env;
    
    // if New create token please edit row 35 col 67 
    const sendTextMessage =  (userId, text) => {
      console.log(userId);
      console.log(text);
      return   fetch(
        `https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBADBZAPAyg0ZA7lZBpZCZCPAP6HB8drdq8mEX2IAhYZCBPt1N1PXL0VZAs32RvqZC9ZC7Ol3eYPZBf9ZAEP2BF4iQkmEFZAE1XsSM4OBf8YRYV6pZC5bY5HxBIb8W6U6zGRfZACT6Q1V4H3ycfD9W101mgMqX6HEkEsqxHDFHW25RTGuu1U`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            messaging_type: 'RESPONSE',
            recipient: {
              id: userId,
            },
            message: {
              text,
            },
          }),
        }
      );
    }

    module.exports = (event) => {
      const userId = event.sender.id;
      const message = event.message.text;

      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: languageCode,
          },
        },
      };

      sessionClient
        .detectIntent(request)
        .then(responses => {
          const result = responses[0].queryResult;
          return sendTextMessage(userId, result.fulfillmentText);
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    }