const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAKgKmy9ZAuS0OXCZCzFQxvWZAYf9aTe9MEZC9ZBLaeaUhUivFMl58uews1EQT5LERj7pcQC1P3teWfgWlx0RSRLb9WA32IzTrP0oZAvg4mYdOt1rMZCBSmafSTIgtaZBIvfFELYKIzCZCwkFYZCxHOBkRZADK1NXh3WUxBFFWYwTKZBt",
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
