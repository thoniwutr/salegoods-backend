const firebase = require("./firebasedb");
var uuid = require("uuid");
const facebook = require("./facebook");

async function createOrder(req, res) {
  let payload = req.body;

  //Find transaction in this post ID
  const snapshot = await firebase.fireStore
    .collection("Transactions")
    .where("transactionDetail.postId", "==", payload.postId)
    .where("txnStatus", "==", "created")
    .get();

  try {
    if (snapshot.empty) {
      res.status(404).send("Not found");
      return;
    } else {
      const translations = [];
      snapshot.forEach((doc) => {
        console.log(doc.data().transactionDetail.customerFacebookId);
        translations.push(doc.data());
      });

      unique = [
        ...new Set(
          translations.map((a) => a.transactionDetail.customerFacebookId)
        ),
      ];

      const customer = [];
      const order = [];

      unique.forEach((facebookId) => {
        const txnFilter = translations.filter(
          (txn) => txn.transactionDetail.customerFacebookId == facebookId
        );
        products = [...new Set(txnFilter.map((a) => a.productId))];
        customer.push({ products, facebookId });
      });

      customer.forEach((product) => {
        const productDetail = [];
        const txn = translations.find(
          (txn) =>
            txn.transactionDetail.customerFacebookId == product.facebookId
        );
        const orderData = {
          postId: txn.transactionDetail.postId,
          customerfacebookId: product.facebookId,
          createdDate: new Date().toDateString(),
          customerName: txn.transactionDetail.username,
          orderStatus: "waiting for payment",
        };

        product.products.forEach((productId, index) => {
          const txnFilter = translations.filter(
            (txn) =>
              txn.transactionDetail.customerFacebookId == product.facebookId &&
              txn.productId == productId
          );
          let txnId = [];
          let totalQuantity = 0;
          let price = 0;
          txnFilter.forEach((txn) => {
            txnId.push(txn.id);
            if(txn.transactionDetail.wording === "CF"){
              totalQuantity += txn.quantity;
              price += txn.productPrice;
            }else if(txn.transactionDetail.wording === "CC"){
              totalQuantity -= txn.quantity;
              price -= txn.productPrice;
            }

          });
          productDetail.push({ productId, txnId, productName : txnFilter[0].productName,totalQuantity, price });
        });
        order.push({ id: uuid.v4(), orderData, productDetail: productDetail });
      });

      console.log(order);
      const payload = JSON.parse(JSON.stringify(order));
      console.log(payload);

      order.forEach((payload) => {
        firebase.recordOrder(firebase.fireStore, payload);
      });

   
      order.forEach((payload) => {
        let orderMsg = ''
        let totalPriceMsg = 0
        payload.productDetail.forEach((item) => {
          orderMsg += `ชื่อสินค้า: ${item.productName} จำนวนสินค้า: ${item.totalQuantity} ราคา: ${item.price} บาท\n`
          totalPriceMsg += item.price
      })
      console.log(orderMsg)
      console.log(totalPriceMsg)
      facebook.sendTextMessage(
        payload.orderData.customerfacebookId,
        `ขอสรุปออเดอร์ของท่านดังนี้\nรายละเอียดสินค้าที่ท่าน CF ใน live นี้\n${orderMsg}\nรวมราคาสินค้าทั้งหมด ${totalPriceMsg} บาท\n**************************`
      );
    })


      res.send(payload);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }

  // const docRef = firebase.fireStore.collection("OrderTmp").doc("222");
  // docRef.set(json);

  // const livePayload = {
  //     orderId : fbCommentDetail.CommentID,
  //     orderAmount: "...",
  //     customerName: "....",
  //     productList: "....",
  //     orderStatus: "....",
  //     postId: "......"
  // }
  // insertRealTimeLive(fs, livePayload)
}

module.exports = { createOrder };
