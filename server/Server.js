const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const path=require('path');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const app=express();
const httpServer=http.createServer(app)
let io=socketIO(httpServer);

//import models
const {User}=require("../models/users.js");
const {Message}=require("../models/messages.js");

//configure nodejs to run env 
 dotenv.config();

//set view enigine and set directories for html files
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../public/views'));


let PORT=process.env.PORT||20000;
let URI=process.env.DBURI;
let DBNAME=process.env.DBNAME;

//set access to static public files
app.use(express.static('public'));


//allow express to read JSON and encoded URLs
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//renders login page of App
app.get('/',(request,response)=>{
	
		response.render('index.ejs',{title:'Login'});
	
	
})


app.get('/menu',(request,response)=>{
	response.render('menu.ejs');
})

app.get('/chat',(request,response)=>{
	
	response.render('chat.ejs');
})


app.get('/signup',(request,response)=>{
	
	response.render('signup.ejs');
})

//POSTS new users to chatAPPDB
app.post('/users',(request,response)=>{
	
	console.log("post request body:",request.body)
	let user=new User(request.body);
	user.save().then(result=>{
		response.status(200).json({redirect:"/",})
	})
	console.log("A new user was added to the database")
})

app.get('/users',(request,response)=>{
	User.find().then(result=>{
		response.status(200).json({users:result})
	})
});


//array to store list of new clients that connect to server
let clients=[];
//use httpServer to listen for connections
io.on('connection',(socket)=>{
	console.log("a new user with id: " + socket.id +" has arrived");
	clients.push(socket.id);
	 
	 //deals with user disconnect
	 socket.on('disconnect', function() {
       const  user_data=socket.id;
	   io.emit('disconnect_msg',{msg:"you were disconnected from server"});
	  if(user_data){
		  console.log("User"+socket.id+" was disconnected")
	  }
    });	
	
	//deals with successful login 
	socket.on("login_success", (data)=>{
		if(data.status==='success'){
		let loggedInUser=data.username;
	    io.emit('Login_msg',{username:loggedInUser})
		}	  	
	})	
	
	//deals with client request to send messages
socket.on('send_msg_req',(data)=>{
			io.emit('send_msg_req',data);
			});
})


httpServer.listen(PORT,()=>{

    console.log(`listening on port ${PORT}`)
	//connect to mongoDB
	mongoose.connect(URI,{dbname:DBNAME}).then(result=>{
		console.log("connected sucessfully to chatAppDB");
	})
	.catch(error=>{
		console.log('Error:',error)
	})

})
