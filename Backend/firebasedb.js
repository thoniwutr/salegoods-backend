const facebook = require("./facebook");
var uuid = require("uuid");
const dialogFlow = require("./dialogflow");
const { getFirestore } = require("firebase-admin/firestore");

let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");
const e = require("express");
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
    var doc = await docRef.get();
    if (doc.exists) {
      //console.log(doc.data()); //see below for doc object
      return doc.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error getting document:", error);
  }
};


function commentIsExists(fs, fbCommentDetail) {
  const docRef = fs.collection("RealtimeLive").doc(fbCommentDetail.CommentID);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", fbCommentDetail.CommentID);
      } else {
        console.log("No such document exist", fbCommentDetail.CommentID);
        const livePayload = {
          commentId: fbCommentDetail.CommentID,
          commentMsg: fbCommentDetail.CommentMessage,
          createdTime: fbCommentDetail.CreatedTime,
          customerFacebookId: fbCommentDetail.FacebookUserID, // for sending message to customer
          username: fbCommentDetail.UserName,
          pageId: fbCommentDetail.PageID,
          pageName: fbCommentDetail.PageName,
          postId: fbCommentDetail.PostID,
          statusProcess: "pending",
        };
        insertRealTimeLive(fs, livePayload);
        console.log("insert sucess");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      return false;
    });
}

function insertRealTimeLive(fs, fbComment) {
  const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
  docRef.set(fbComment);
}

function insertTransaction(fs, transactionData) {
  const docRef = fs.collection("Transactions").doc(transactionData.id);
  docRef.set(transactionData);
}

function updateProcess(fs, commentId, process) {
  const docRef = fs.collection("RealtimeLive").doc(commentId);
  docRef.update({ statusProcess: process });
}


function updateTransactionStatus(fs, txnId, newStatus) {
  const docRef = fs.collection("Transactions").doc(txnId);
  docRef.update({ txnStatus: newStatus });
}

function updateTxnCancelling(fs, txnId) {
  const docRef = fs.collection("Transactions").doc(txnId);
  docRef.update({ isCancelled: true });
}

function recordOrder(fs, order) {
  const docRef = fs.collection("Order").doc(order.id);
  docRef.set(order);
  order.productDetail.forEach((product) => {
    product.txnId.forEach((id) => {
      updateTransactionStatus(fs, id, "completed");
    });
  });
}

async function handleCALLLogistic(fs,facebookId,commentId) {
  const snapshot = await fs
  .collection("Order")
  .where("orderData.customerfacebookId", "==", facebookId)
  .limit(1)
  .get();

  if (snapshot.empty) {
    snapshot.forEach((doc) => {
      facebook.sendTextMessage(
        facebookId,
        "ไม่มีรายการของคุณที่ยังไม่ได้จัดส่ง"
      );
    })
  }else{
    snapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data)
      facebook.sendTextMessage(
        facebookId,
        `รายการสั่งซื้อ ${data.orderData.createdDate}\nสถานะ : ${data.orderData.orderStatus}\n+++++++++++++++++++++++++++++\n*ระยะเวลาในการส่งสินค้าใช้เวลา 3-7วันขึ้นอยู่กับขนส่งแต่ละพื้นที่\n**หากท่านชำระเงินแล้วสินค้าจะถูกส่งในวันถัดไป”`
      );
    })
  }
  updateProcess(fs, commentId, "done");
}


async function handleLogisticPrice(fs,facebookId,commentId) {
  const snapshot = await fs
  .collection("UserManagement")
  .limit(1)
  .get();

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data)
      facebook.sendTextMessage(
        facebookId,
        `ค่าส่งสินค้า ${data.deliveryPrice}บาท ต่อออเดอร์`
      );
    })
  }
  updateProcess(fs, commentId, "done");
}

async function handleHowToBuy(fs,facebookId,commentId) {
  const snapshot = await fs
  .collection("UserManagement")
  .limit(1)
  .get();

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data)
      facebook.sendTextMessage(
        facebookId,
        `หากท่านทำการCF สินค้าแล้ว โปรดรอรับข้อความตอบกลับ ถือว่าเป็นได้รับสินค้าแล้ว เรื่องการชำระเงินขอให้ชำระเงินหลังจาก โดยการโอนมาที่ ${data.bankTransferDetail}`
      );
    })
  }
  updateProcess(fs, commentId, "done");
}

async function handleAskPrice(fs,facebookId,commentId, wordingOrder) {
  const snapshot = await fs
  .collection("Products")
  .where("wordingOrder","==",wordingOrder)
  .limit(1)
  .get();

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data)
      facebook.sendTextMessage(
        facebookId,
        `${data.price} THB ต่อชิ้น`
      );
    })
  }
  updateProcess(fs, commentId, "done");
}


async function handleAskAvailable(fs,facebookId,commentId, wordingOrder) {
  const snapshot = await fs
  .collection("Products")
  .where("wordingOrder","==",wordingOrder)
  .limit(1)
  .get();

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data)
      facebook.sendTextMessage(
        facebookId,
        `${data.available} THB ต่อชิ้น`
      );
    })
  }
  updateProcess(fs, commentId, "done");
}

async function handleAskDetail(fs,facebookId,commentId, wordingOrder) {
  const snapshot = await fs
  .collection("Products")
  .where("wordingOrder","==",wordingOrder)
  .limit(1)
  .get();

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      var data = doc.data();
      console.log(data)
      facebook.sendTextMessage(
        facebookId,
        `${data.productDetail} THB ต่อชิ้น`
      );
    })
  }
  updateProcess(fs, commentId, "done");
}


async function getProduct(fs, productJSON, wording, iProductNo, iQuantity) {
  console.log(wording + " " + iProductNo + " " + iQuantity);

  const snapshot = await fs
    .collection("Products")
    .where("wordingOrder", "==", iProductNo)
    .where("available", "==", "available")
    .limit(1)
    .get();
 
  let txnSnapshot = null
   
  if (wording == 'CC') {
      const doc = snapshot.docs[0]
      console.log(doc.data())
      txnSnapshot = await fs
      .collection("Transactions")
      .where("transactionDetail.postId", "==", productJSON.postId)
      .where("transactionDetail.wording","==","CF")
      .where("isCancelled","==",false)
      .where("transactionDetail.customerFacebookId", "==", productJSON.customerFacebookId)
      .where("productId", "==", doc.data().id)
      .get();
  }
  

  // CF
  if (wording == "CF") {
    if (snapshot.empty) {
      console.log("No matching documents.");
      facebook.sendTextMessage(
        productJSON.customerFacebookId,
        "ไม่มีรหัสสินค้าหรือสินค้านี้ไม่เปิดในการขายครั้งนี้"
      );
      updateProcess(fs, productJSON.commentId, "done");
      return;
    }

    snapshot.forEach((doc) => {
      const docRef = fs.collection("Products").doc(doc.id);
      if (doc.data().quantity > 0) {
        console.log(doc.data().quantity);
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
            transactionDetail: productJSON,
            productId: doc.data().id,
            productName: doc.data().productName,
            quantity: iQuantity,
            isCancelled : false,
            productPrice: doc.data().price,
            createdDate: new Date().toString(),
            txnStatus: "created",
            // for sending message to customer
          };
          insertTransaction(fs, transactionData);
          updateProcess(fs, productJSON.commentId, "done");
        } else {
          // จำนวนสินค้ามากกว่าที่ลูกค้าต้องการ  >> create order
          var currentQuantity = doc.data().quantity;

          docRef.update({ quantity: 0 });
          // Send Message
          facebook.sendTextMessage(
            productJSON.customerFacebookId,
            `ขอขอบพระคุณสำหรับการ CF\n\nเนื่องจากสินค้าของเรามีไม่เพียงพอต่อความต้องการจึงได้สินค้าเพียงบางส่วนตามรายละเอียดดังนี้\n++++++++++++++++++\nรหัสสินค้า: ${iProductNo}\nชื่อสินค้า:${doc.data().productName}\nจำนวนสินค้า: ${currentQuantity}\n++++++++++++++++++`
          );
          // Create Transaction
          const transactionData = {
            id: uuid.v4(),
            transactionDetail: productJSON,
            productId: doc.data().id,
            productName: doc.data().productName,
            quantity: currentQuantity,
            isCancelled : false,
            productPrice: doc.data().price,
            createdDate: new Date().toString(),
            txnStatus: "created",
            // for sending message to customer
          };
          insertTransaction(fs, transactionData);
          updateProcess(fs, productJSON.commentId, "done");

          //
          docRef.update({ quantity: 0 });
        }
      } else {
        // send msg สินค้าหมดแล้วนะ
        facebook.sendTextMessage(
          productJSON.customerFacebookId,
          ` ขออภัย รหัสสินค้า: ${iProductNo} ที่ท่านต้องการนั้นหมดแล้ว ไว้โอกาสหน้าให้ทางเพจได้ดูแลอีกครั้ง ขอขอบพระคุณค่ะ`
        );
      }
    });
  } else if (wording == "CC") {
    if (snapshot.empty) {
      console.log("No matching documents.");
      facebook.sendTextMessage(
        productJSON.customerFacebookId,
        `ไม่มีรหัสสินค้า: ${iProductNo} นี้ในรายการสั่งซื้อของท่าน`
      );
      updateProcess(fs, productJSON.commentId, "done");
      return;
    }

    snapshot.forEach((doc) => {
      const docRef = fs.collection("Products").doc(doc.id);
      let countProductQuantity = 0
      txnSnapshot.forEach((value) => {
         const txnRef = fs.collection("Transactions").doc(value.id);
         const txn = value.data()
         countProductQuantity += txn.quantity
         updateTxnCancelling(fs,txn.id)         
      })

      

      var quantityRemaining = doc.data().quantity + countProductQuantity;
      docRef.update({ quantity: quantityRemaining });

      if(countProductQuantity > 0){
        facebook.sendTextMessage(
          productJSON.customerFacebookId,
          `ท่านได้ทำการยกเลิกสินค้า\n\n++++++++++++++++++\nรหัสสินค้า: ${iProductNo}\nชื่อสินค้า:${doc.data().productName}\nจำนวนสินค้า: ${countProductQuantity}\n++++++++++++++++++\nเรียบร้อยแล้วค่ะ`
        );
      }else{
        facebook.sendTextMessage(
          productJSON.customerFacebookId,
          `ไม่มีรหัสสินค้า: ${iProductNo} นี้ในรายการสั่งซื้อของท่าน`
        );
      }

         // Create Transaction
         const transactionData = {
          id: uuid.v4(),
          transactionDetail: productJSON,
          productId: doc.data().id,
          productName: doc.data().productName,
          quantity: countProductQuantity,
          productPrice: doc.data().price,
          createdDate: new Date().toString(),
          txnStatus: "created",
          // for sending message to customer
        };
        insertTransaction(fs, transactionData);
        updateProcess(fs, productJSON.commentId, "done");
    });

  } 
}

module.exports = {
  insertRealTimeLive,
  getProduct,
  updateProcess,
  commentIsExists,
  recordOrder,
  handleCALLLogistic,
  handleLogisticPrice,
  handleAskPrice,
  handleHowToBuy,
  handleAskAvailable,
  handleAskDetail,
  admin,
  fireStore,
};
