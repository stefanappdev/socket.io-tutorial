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





app.get('/',(request,response)=>{
	
	response.render('index');
})



app.get('/signup',(request,response)=>{
	
	response.render('signup');
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
	
	socket.on("login", (data)=>{
		console.log("from client:",data.msg);
	})
	socket.emit('from mr server',{msg:'hey client,whats up?'})
})



httpServer.listen(PORT,()=>{

    console.log(`listening on port ${PORT}`)
	
})
