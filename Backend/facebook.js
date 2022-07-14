const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAFAv8uC84LTMUAIZCF0YoJzRRlsR4t6vo1qwiHQ3EARTqBakxJw9LPVD3xtWgSMRXUKHHpeGXBL0sL3SxDs733j7ZAw9TsCcKXrd3qJe0VFGFaZAoAT8B6cv7R3U8yjqlX7jx2AuMqijimPCSu5SDZBbUN8Uxb8AKhPWZA4tk",
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
