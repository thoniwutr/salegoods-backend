const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAGO9f5hxaqeZBIHTV3vya5SbDdrZBr7Y37RhtPFmgE97XTGC78FfSBZA4mGkUiojZBh1LJ59HZBABEZB37fpRI3Qyns4srwZC88YPysjxT5G4jkyJ3qxQLZBbOn6RNQ29hVhBxgsUZCbpdI66p2t7izwiJ2SNyY42XzEbS27a02Yo",
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
