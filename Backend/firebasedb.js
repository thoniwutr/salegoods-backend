
const facebook = require("./facebook");
var uuid = require('uuid');

function updateHasProcessStatus(fs, fbComment) {
	const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
	docRef.set(fbComment);
}


function commentHasProcess(fs, commentId) {
	const docRef = fs.collection("RealtimeLive").doc(commentId);
	return docRef.hasProcess
}


function insertRealTimeLive(fs, fbComment) {
	const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
	docRef.set(fbComment);
}


function insertTransaction(fs, transactionData) {
	const docRef = fs.collection("Transactions").doc(uuid.v4());
	docRef.set(transactionData);
}



function updateProcess(fs, commentId) {
	const docRef = fs.collection("RealtimeLive").doc(commentId);
	docRef.update({hasProcess: true});
}


async function getProduct(fs,productJSON, wording, iProductNo, iQuantity) {

	updateProcess(fs,  productJSON.commentId)

	console.log(wording + " " + iProductNo + " "+ iQuantity)

	const snapshot = await fs.collection("Products").where('WordingOrder', '==', iProductNo).where('Available', '==', true).get();

	// CF
	if(wording == 'CF'){
	if (snapshot.empty) {
	  console.log('No matching documents.');
	  facebook.sendTextMessage(productJSON.customerFacebookId,"ไม่มีรหัสสินค้าหรือสินค้านี้ไม่เปิดในการขายครั้งนี้")
	  return;
	}  

	snapshot.forEach(doc => {
		const docRef =  fs.collection("Products").doc(doc.id);
		if(doc.data().quantity > 0 ){
			 var quantityRemaining = doc.data().quantity - iQuantity
			if(quantityRemaining >= 0){ // can create order 120 - 5 = 115 : create order
				// จำนวนสินค้ามากกว่าที่ลูกค้าต้องการ  >> create order
				docRef.update({"quantity": quantityRemaining});
				// Send Message
				facebook.sendTextMessage(productJSON.customerFacebookId,`ลูกค้าได้ทำการจองสินค้า ${iProductNo} ${doc.data().productName} ${doc.data().productDetail} จำนวน ${iQuantity} สำเร็จ`)
				// Create Transaction
				const transactionData = {
					transactionID : uuid.v4(),
					productID : doc.data().product_id,
					userFacebookID : productJSON.customerFacebookId,
					quantity : iQuantity,  // for sending message to customer
				}
				insertTransaction(fs,transactionData)
				
			}else{
				// จำนวนสินค้ามากกว่าที่ลูกค้าต้องการ  >> create order
				 var currentQuantity = doc.data().quantity
				docRef.update({"quantity": 0});
			}
		}else{
			  // send msg สินค้าหมดแล้วนะ
		}	
	});
} 
else if(wording == 'CC'){

}else if(wording == 'question_price'){

}


	

}

module.exports = { insertRealTimeLive, getProduct, commentHasProcess, updateProcess }
