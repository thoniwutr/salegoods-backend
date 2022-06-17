const fetch = require("node-fetch");
// //import fetch from "node-fetch";
// // You can find your project ID in your Dialogflow agent settings
const projectId = "bsd-salegoods"; // //https://dialogflow.com/docs/agents#settings
const sessionId = "123456";
// //const languageCode = "en-US";
const languageCode = "th-TH";
const dialogflow = require("dialogflow");

const config = {
// // credentials: {
// //   private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
// //   client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
// // }
  credentials: {
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuDoC9eHHi6OMg\nglstPsOT+QAdI8S3fY++yA1z9iTg34pqUOC4HgXpI5UPHoDC4r/bCTW5X9QlMRVg\nTOKoyt24XdBFrXZKXAXgUxJs7kQrObx0qnDKEDubWyMPSwilf0mNGxaSx1/uiT51\n/k/FeO5tCKLf4vsXX8/ba/WHXbJyVZpGOUcUwEFKiTcJta3ebPa9gyiXw6j7OYbs\nYn2Ef+y5tYUMwRhVloJ8PpNi+EvpT4EHqlynIZ1yk1h62hu8BuHMhe7NMttra9Oj\njSTHw23f2TB4co88LWgqiEG12ooAGuv9Jad+SVtkM7Q0thyXnZceXfu6NS9srdvy\na8otsjWBAgMBAAECggEAEd2Bt9DgyaRTSb8vihuW2f2VFiiZdKcB5dhlTxl87Art\ny19NTYChZS5mipR8LWS2Qg52MfaE0SNyWP3TRvV5oAabDcfR7Cx5Wu7T5ZPoMdKd\nhhEHfin/4ECQvu1Z8Bi6TS4yWTL3JQX3wAcwG2n/+PeJtja3RI0sSc6RN0l1+zek\nHNCrrDJNtqd+sIyNzdGGCHkOuZm6oeLrpqmM/tCjF9TMnsCA04eYDYoeCILakjN9\nv+WV/GeGd2YkPEkj+B02fpebaIsz2S42GNFBRI2KXGGF0HrEWYijofk8d56yW2JA\n6d5gsygEVwrE/hxiCE4ZCRFjYQyzp9VQTbQ06UKJZQKBgQDmN9a5B83BRQqXHEnx\nR7kSKiJ+83+ADvmXo5YT3/suXuuHI3C0eHNo8/p/02jJVF00HsSxBRqpcctiSwU+\nHp/RKkGW4bs79ZmEBDo1IA6NaiW8rcdgOOrHwXfBCXyIUzn4WQNIzn5DGCTP7Ev4\nrnvnCDSuoPPJ7Ltc6lhPREey3QKBgQDBjI/OHXcEnRsXsPBhZkDQakXHAZMDvwun\nB6zd7lM3Q1JLfRgerMd5bk337S9k23HZskg2yeuE2dXMvtq+zEqajOTjDOy4Cj3Z\nfgeby1XQTEyktFENVwFQfvPFlyw4Jp5vj0SXDD6d+siDc4wl9WZn5UeupCHF1vwc\nI8WN08+o9QKBgQCDMw1e05Cx9UvMxGVraQmSzYptOQ3PiDk77xFncD0wtw2ZLVxc\nrUxwYqK+2FeebULUojhL/fGs4VocQU7SkRdZV7CbcTeIOzZq4xHdFtDUTMsG1S6L\nqsQ6ZQp/a42aD3w5CVly06NnT0ojaLH/HkkkaCvF3Zox2IUKtc7wFaSazQKBgFbh\n7S/eJC4rBB1nbRCb4R5thjMmLsNwwB9Tn7LkJ/DXxJpkZi5m6whEjrVrgGnq5DmQ\nAUCu9Y1mZ8YIKpOZiyfDdX/CroSS/F6kZ2/1H+loRsNsujGdy9ZBltYs3Um7dEWp\n72VKttUd3WK8vL3RYg3ja4Em5o4zymorWKQo37/9AoGAAqLbMnFpDXUvyf3E9sjq\nFmfjmuzpAuAz/M0htLS0kAnji5kvte31AF5BEse6xSo9pqwf37v6vaT6XWq3zN2p\nQqSFihUYukGPKpcrOPxHhktkpvzzBmBMTZAY279h/NPnx5k2VShlBb8JGhST6yFz\nEtMrIcDp3+III3M9vStaB5s=\n-----END PRIVATE KEY-----\n",
// // client_email: "poppurik@gmail.com"
    client_email: "masterbackend-701@bsd-salegoods.iam.gserviceaccount.com",
  },
};

const sessionClient = new dialogflow.SessionsClient(config);
// //console.log(sessionClient);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// // Remember the Page Access Token you got from Facebook earlier?
// // Don"t forget to add it to your `variables.env` file.
// // const { FACEBOOK_ACCESS_TOKEN } = process.env;

// // if New create token please edit row 35 col 67
const sendTextMessage = (userId, text) => {
  console.log(userId);
  console.log(text);
  return fetch(
    "https://graph.facebook.com/v2.6/me/messages?access_token=https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAPTCyzysZAhY0rXGe33VaesquZCe63YMWDSHJaNfoN3JHf9KI7WvenW9zWpZB6FZCCgKSL56MiYp1togCDuTNlQLyE0cgZAvs4ceh4bkxi7xceQ5WESkBMTZAFN6fJ00qwQ5qdUVwLaYM4MaZBH77nctCjaifmyZBxjACThJq7og",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        messaging_type: "RESPONSE",
        recipient: {
          id: userId,
        },
        message: {
          text,
        },
      }),
    }
  );
};

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
    .then((responses) => {
      const result = responses[0].queryResult;
      return sendTextMessage(userId, result.fulfillmentText);
    })
    .catch((err) => {
      console.error("ERROR:", err);
    });
};
