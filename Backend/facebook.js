const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAEikuRxLqfBMWpJqsZBwAujprZAGZCh5uYYdBpzpcEG6HCtOMrA6KqzZAenE4TUB6ETWOILC6ZB0K5kPQr9CMlcwAdTgNZApr5OgZC5O9cHZAxr2tt1G4n3xswvKFSCN0e75aYopLdRssCmqS7P3wahMjKJ61ThzOpFZBwq128YJq",
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
