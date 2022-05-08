const DialogFlowType = {
	commentId : string,
	commentMsg : string,
	createdTime : string,
	customerFacebookId : string,  // for sending message to customer
	username : string,
	pageId: string,
	pageName : string,
	postId: string,

	//parameters
	wording: string,
	productList : [productDetail],
}


const ProductDetail = {
	productNo : string,
	quantity : string,
}

module.exports = { DialogFlowType }
