const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
const Server=express();


//configure nodejs to run env 
 dotenv.config();

//set view enigine and set directories for html files
Server.set('view engine','ejs');
Server.set('views',path.join(__dirname,'../public/views'));


let PORT=process.env.PORT||20000

//set access to static public files
Server.use(express.static('public'));

Server.get('/',(request,response)=>{
        response.render('index');
})

Server.listen(PORT,()=>{

    console.log(`listening on port ${PORT}`)
})
