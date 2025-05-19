const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const path=require('path');
const dotenv=require('dotenv');
const app=express();
const httpServer=http.createServer(app)
let io=socketIO(httpServer);

//configure nodejs to run env 
 dotenv.config();

//set view enigine and set directories for html files
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../public/views'));


let PORT=process.env.PORT||20000

//set access to static public files
app.use(express.static('public'));





app.get('/login',(request,response)=>{
	
	response.render('index.ejs');
})

app.get('/chat',(request,response)=>{
	
	response.render('chat.ejs');
})


app.get('/signup',(request,response)=>{
	
	response.render('signup.ejs');
})


//array to store list of new clients that connect to server
let clients=[];
//use httpServer to listen for connections
io.on('connection',(socket)=>{
	console.log("a new user has arrived");
	clients.push(socket.id);
	 
	 //deals with user disconnect
	 socket.on('disconnect', function() {
        console.log('user'+socket.id+' was disconnected');
	 let remaining_clients=clients.filter(usr=>usr.id!==socket.id);
	  
    });	
	
	//deals with successful login 
	socket.on("login_success", (data)=>{
		if(data.status==='success'){
		let loggedInUser=data.username;
	    io.emit('Login_msg',{username:loggedInUser,greetmsg:loggedInUser})
		}	  	
	})	
	
	//deals with client request to send messages
			socket.on('send_msg_req',(data)=>{
			io.emit('accept_req',{msg:data.msg,username:data.user})
			});
})


httpServer.listen(PORT,()=>{

    console.log(`listening on port ${PORT}`)
	
})
