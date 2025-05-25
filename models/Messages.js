const mongoose=require('mongoose');

const MessageSchema=new mongoose.Schema({
	sendingUserId:{
		 type:String,
		 required:true
	 },
	 
	 dateSent:{
		 type:String,
		 required:true,
	 },
	
	 receivingUserId:{
		 type:String,
		 required:true,
	 }
})


const Message=new mongoose.model("Messages",MessageSchema);
module.exports={Message};