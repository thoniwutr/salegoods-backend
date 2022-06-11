const express = require("express");
//const bodyParser = require('body-parser');
const verifyWebhook = require("./verify-webhook");
const messageWebhook = require("./message-webhook");
//const sheetGoogle = require('./sheetGoogle');
//live facebook to dialogflow
const dialogFlow = require('./dialogflow');
const firebaseDB = require('./firebasedb');
const { firestore } = require("firebase-admin");

const app = express();
//for massenger
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", verifyWebhook);
app.post("/", messageWebhook);

app.listen(5001, () => console.log("Express server is listening on port 5001"));

connectFirebase();

function connectFirebase() {
  let admin = require("firebase-admin");
  const { getFirestore } = require('firebase-admin/firestore');
  let serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://bsd-salegoods-default-rtdb.asia-southeast1.firebasedatabase.app",
  });

  // As an admin, the app has access to read and write all data, regardless of Security Rules
  var realtimeDB = admin.database();

  var fireStore = getFirestore();

  var ref = realtimeDB.ref("fbComment");
//   ref.once("value", function (snapshot) {
//     console.log(snapshot.val());
//   });
//ref.child('509535760832977_1687136051619185').update({ hasProcess: true });

  // Attach an asynchronous callback to read the data at our posts reference
  ref.on('value', (snapshot) => {

	const fbObj = snapshot.val();


	  snapshot.forEach(function(data) {
        //console.log(data.val().hasProcess);
		var commentMsg = data.val().CommentMessage;
		var fristRound = false;

		var hasProcess = firebaseDB.commentHasProcess(fireStore,data.val().CommentID)

		// if(fristRound == true){
		// 	if(commentIDflag != data.val().CommentID){
		// 		//set hasProcessFlag = true
		// 		//save value to firebase realtime
		// 	}
		// }else{
		// 	var commentIDflag = data.val().CommentID;
		// 	fristRound == true
		// }

		if(hasProcess != true){
		dialogFlow.processDialogFlow(realtimeDB,fireStore, data.val());
		}
	
		// var productNo = "T1";
		// var quatity = "2";
		// const db =  getFirestore();
		// getProduct(db);
		// updateProduct(db);
    });

	  // 1.Filter comment already process on dialogFlow?

  	 // 2. process dialog flow ->> return ideal wording 
	
  }, (errorObject) => {
	console.log('The read failed: ' + errorObject.name);
  }); 


}

async function getProduct(fs) {
	
	const docRef = await fs.collection("Products").get();
	docRef.forEach((doc) => {
		console.log(doc.id, '=>', doc.data());
	  });
}

 function updateProduct(fs) {
	const docRef =  fs.collection("Products").doc("4UKrx7fCxwV1wn0MuVkg");
	docRef.update({"quantity": 122});
}