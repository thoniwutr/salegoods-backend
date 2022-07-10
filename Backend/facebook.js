const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAClybg7C5sWJuQzBUOujqMvGdKNRo2RY9yfs2LwzFVkHPnHDVGlkcZANXSQMH1boab58MZC1gx8q73EBXH3KXblKEMKTmbZBYZAQlcXDpihK8CaqqUUNfIn7wXkxEQdD3KZBZA011H1ZAZCcFrSogAeWfoExy5UQFEZBEZBkHjQOAJ",
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
	) .then(user => {
		console.log(user);
	  })
	  .catch(err => {
		console.error(err);
	  });
  }catch (err) {
	console.error(err);
  }
}
  

  module.exports = { sendTextMessage  }
