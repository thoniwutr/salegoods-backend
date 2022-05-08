function updateHasProcessStatus(fs, fbComment) {
	const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
	docRef.set(fbComment);
}


function insertRealTimeLive(fs, fbComment) {
	const docRef = fs.collection("RealtimeLive").doc(fbComment.commentId);
	docRef.set(fbComment);
}

async function getProduct(fs,productJSON, wording, iProductNo, iQuantity) {

	console.log(wording + " " + iProductNo + " "+ iQuantity)

	const snapshot = await fs.collection("Products").where('WordingOrder', '==', iProductNo).where('Available', '==', true).get();

	if (snapshot.empty) {
	  console.log('No matching documents.');
	  // send msg รหัสสินค้าไม่ตรง

	  return;
	}  

	snapshot.forEach(doc => {
		const docRef =  fs.collection("Products").doc(doc.id);
		if(doc.data().quantity > 0 ){
			 var quantityRemaining = doc.data().quantity - iQuantity
			if(quantityRemaining >= 0){ // can create order 120 - 5 = 115 : create order
				// จำนวนสินค้ามากกว่าที่ลูกค้าต้องการ  >> create order
				docRef.update({"quantity": quantityRemaining});
				// Create Order
				
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

module.exports = { insertRealTimeLive, getProduct }
