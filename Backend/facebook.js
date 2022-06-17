const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAI4NZC1QeKI4o4Gw4o4QWuOY0ZCZAcIl52Pa8nubuhC22Bm3lfdYuyjqTWcdas2wu66d2ENHZCNWjE7uCDFjjRL8KtISBZBzys1Ege4lROQUJtBw6FAnRMhbY0XqaKR7LaEzZAZCXC3vzwx9ikkrXbdlnzNzVJuk1AsM8ODsxhS",
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
