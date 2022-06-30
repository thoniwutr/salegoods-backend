const fetch = require("node-fetch");

async function sendTextMessage(userId, text) {
	try{
	console.log(userId);
	console.log(text);
	await fetch(
		"https://graph.facebook.com/v2.6/me/messages?access_token=EAADZB19riRPkBAEMmnI19yjobDb7YSFE0JSTWJliD7YQ21TeNiYM2OSffoBWEaT6VcaJZAtwGqNOYTqkgFgEEShXUqxusZC7tDNXTCMmYqyhUwxiHo1cbjEQNRB7OetcFc7UvmBjSRcYeCfHYBEEKqBbUdEOrydvCmqc2nOELiOXe5ZCGPp2",
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
