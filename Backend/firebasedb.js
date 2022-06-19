const facebook = require("./facebook");
var uuid = require("uuid");
const dialogFlow = require('./dialogflow');
const { getFirestore } = require('firebase-admin/firestore');

let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://bsd-salegoods-default-rtdb.asia-southeast1.firebasedatabase.app",
});
const fireStore = getFirestore();


function updateHasProcessStatus(fs, fbComment) {
  const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
  docRef.set(fbComment);
}

const grabUserData = async (fs, commentId) => {
  var docRef = fs.collection("RealtimeLive").doc(commentId);
  try {
      var doc = await docRef.get()
      if (doc.exists) {
          //console.log(doc.data()); //see below for doc object
          return doc.data(); 
      } else {
          console.log("No such document!");
      }
  } catch (error) {
      console.log("Error getting document:", error);
  };
}

function commentIsExists(fs, fbCommentDetail)  {
  const docRef = fs.collection("RealtimeLive").doc(fbCommentDetail.CommentID);
   docRef.get().then((doc) => {
    if (doc.exists) {
      console.log("Document data:", fbCommentDetail.CommentID);
    } else {
      console.log("No such document exist", fbCommentDetail.CommentID);
      const livePayload = {
				commentId : fbCommentDetail.CommentID,
				commentMsg : fbCommentDetail.CommentMessage,
				createdTime : fbCommentDetail.CreatedTime,
				customerFacebookId : fbCommentDetail.FacebookUserID,  // for sending message to customer
				username : fbCommentDetail.UserName,
				pageId: fbCommentDetail.PageID,
				pageName : fbCommentDetail.PageName,		
				postId: fbCommentDetail.PostID,
				statusProcess: 'pending'
			}
			insertRealTimeLive(fs, livePayload)
      console.log("insert sucess");
    }

}).catch((error) => {
    console.log("Error getting document:", error);
    return false;
});
}

function insertRealTimeLive(fs, fbComment) {
  const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
  docRef.set(fbComment);
}

function insertTransaction(fs, transactionData) {
  const docRef = fs.collection("Transactions").doc(uuid.v4());
  docRef.set(transactionData);
}

function updateProcess(fs, commentId, process) {
  const docRef = fs.collection("RealtimeLive").doc(commentId);
  docRef.update({ statusProcess: process });
}

function recordOrder(fs, order) {
  const docRef = fs.collection("Order").doc(uuid.v4());
  docRef.set(order);
}


async function getProduct(fs, productJSON, wording, iProductNo, iQuantity) {

  console.log(wording + " " + iProductNo + " " + iQuantity);

  const snapshot = await fs
    .collection("Products")
    .where("wordingOrder", "==", iProductNo)
    .where("available", "==", "available")
    .get();

  // CF
  if (wording == "CF") {
    if (snapshot.empty) {
      console.log("No matching documents.");
      // facebook.sendTextMessage(
      //   productJSON.customerFacebookId,
      //   "ไม่มีรหัสสินค้าหรือสินค้านี้ไม่เปิดในการขายครั้งนี้"
      // );
      updateProcess(fs,productJSON.commentId, "done")
      return;
    }

    snapshot.forEach((doc) => {
      const docRef = fs.collection("Products").doc(doc.id);
      if (doc.data().quantity > 0) {
        console.log(doc.data().quantity)
        var quantityRemaining = doc.data().quantity - iQuantity;
        if (quantityRemaining >= 0) {
          // can create order 120 - 5 = 115 : create order
          // จำนวนสินค้ามากกว่าที่ลูกค้าต้องการ  >> create order
         docRef.update({ quantity: quantityRemaining });
          // Send Message
          facebook.sendTextMessage(
            productJSON.customerFacebookId,
            `ลูกค้าได้ทำการจองสินค้า ${iProductNo} ${doc.data().productName} ${
              doc.data().productDetail
            } จำนวน ${iQuantity} สำเร็จ`
          );
          // Create Transaction
          const transactionData = {
            id: uuid.v4(),
            transactionDetail : productJSON,
            productId: doc.data().id,
            productName : doc.data().productName,
            quantity: iQuantity,
            productPrice: doc.data().price,
            createdDate: new Date().toString(), // for sending message to customer
          };
         insertTransaction(fs, transactionData);
         updateProcess(fs,productJSON.commentId, "done")
        } else {
          // จำนวนสินค้ามากกว่าที่ลูกค้าต้องการ  >> create order
          var currentQuantity = doc.data().quantity;
        //
          docRef.update({ quantity: 0 });
        }
      } else {
        // send msg สินค้าหมดแล้วนะ
             // facebook.sendTextMessage(
      //   productJSON.customerFacebookId,
      //   "สินค้าหมดแล้วนะครับ"
      // );
      }
    });
  } else if (wording == "CC") {
  } else if (wording == "question_price") {
  }
}

module.exports = {
  insertRealTimeLive,
  getProduct,
  updateProcess,
  commentIsExists,
  recordOrder,
  admin,
  fireStore
};
