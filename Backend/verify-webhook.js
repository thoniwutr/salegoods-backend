const verifyWebhook = (req, res) => {
	let VERIFY_TOKEN = "pusher-bot";
  
	let mode = req.query["hub.mode"];
	let token = req.query["hub.verify_token"];
	let challenge = req.query["hub.challenge"];
  
	console.log("p-mode", mode);
	console.log("p-token", token);
	console.log("p-challenge", challenge);
	console.log("p-VERIFY_TOKEN", VERIFY_TOKEN);
	if (mode && token === VERIFY_TOKEN) {
	  res.status(200).send(challenge);
	} else {
	  res.sendStatus(403);
	}
  };
  
  module.exports = verifyWebhook;
  