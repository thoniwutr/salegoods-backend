const express = require("express");
//const bodyParser = require('body-parser');
const verifyWebhook = require("./verify-webhook");
const messageWebhook = require("./message-webhook");
//const sheetGoogle = require('./sheetGoogle');
//live facebook to dialogflow
const dialogFlow = require('./dialogflow');
const firebaseDB = require('./firebasedb');
const { firestore } = require("firebase-admin");
const facebook = require("./facebook");

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
    facebook.sendTextMessage(
        "241205487847701",
        "ไม่มีรหัสสินค้าหรือสินค้านี้ไม่เปิดในการขายครั้งนี้"
      );


  var fireStore = getFirestore();

  var ref = realtimeDB.ref("fbComment");
 
  ref.on('value',  (snapshot) => {

	 snapshot.forEach(function(data) {
		var fbCommentDetail = data.val()
		//Check Comment is already in live time live 
		var documentIsExists =  firebaseDB.commentIsExists(fireStore,fbCommentDetail)
	
		// let promise = new Promise((resolve, reject) => {
		// 	setTimeout(() => {
		// 		// dialogFlow.processDialogFlow(fireStore, data.val());
		// 		firebaseDB.commentHasProcess(fireStore,fbCommentDetail)
		// 	}, 1000); 
		//  });

	
		let promise = new Promise((resolve, reject) => {
			setTimeout(() => {
				const docRef = fireStore.collection("RealtimeLive").doc(fbCommentDetail.CommentID);
				docRef.get().then((doc) => {
				const process = doc.data().statusProcess
				if(process == 'pending'){
					dialogFlow.processDialogFlow(fireStore, doc.data());
				}else{
					//TODO
				}
			 
			 }).catch((error) => {
				 console.log("Error getting document:", error);
				 return false;
			 });
			}, 2000); 
		 });

	//  promise.then(value => {
	// 		console.log(`Resolved:`);
	// 	});


		// if(hasProcess != 'pending'){
		// 	//console.log(fbCommentDetail.CommentID)
	  //dialogFlow.processDialogFlow(fireStore, data.val());
		// }
		

		// if(fristRound == true){
		// 	if(commentIDflag != data.val().CommentID){
		// 		//set hasProcessFlag = true
		// 		//save value to firebase realtime
		// 	}
		// }else{
		// 	var commentIDflag = data.val().CommentID;
		// 	fristRound == true
		// }

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