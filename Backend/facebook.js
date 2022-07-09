const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAHpte7ZAbVQLzJkZAc7JbUR90suGZBxdf158Goc0WvP8yixx2OWHwh6kaCBJjFSOZAthRTSXqGa3ZBK5ZBX28XpEPfTatdi8q73w3hvmCi7rK6muB8t0ZAFsG8mR2UMV1Wp0hO9kvxZB0jtZBbZAo8eZCtpH8Vxl7YFmcJSKoR4hhES",
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
