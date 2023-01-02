import express from "express";
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import { Server } from "socket.io";
import fs from 'fs';
import testProducts from "./faker.js";
import Messages1 from "./options/FirebaseContainer.js";
import session, {Cookie} from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import initializePassport from "./public/config/passport.config.js";
import passport from "passport";
import flash from "express-flash";
import randomRouter from './routes/random.routes.js'
import config from './config.js'
const app =express();

const connection =mongoose.connect(config.mongo.urlmongo)
const PORT =   config.app.PORT || 3000;
const server = app.listen(PORT,async()=>{
    let existen=await Messages1.getMessage()
    if (existen==0){
        Messages1.createMessagesTable()
        console.log('fue creada la tabla messages')
    }

    let existenchar=await Messages1.getCharacter()
    if (existenchar==0){
        Messages1.createCharacterTable()
        console.log('fue creada la tabla characters')
    }
    // 
    console.log('Its Working')
});
const io= new Server(server);
app.use(express.json());
app.use(session({
    store: MongoStore.create({
        mongoUrl:config.mongo.urlmongo,
        ttl:60
    }),
    secret: "nosequeponer000",
    resave:true,
    saveUninitialized:true,
}));

app.use(flash());
app.use(passport.session());
initializePassport();
app.use(passport.initialize());


app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.urlencoded({extended:true}));
app.use('/',viewsRouter);
app.use('/api/randoms', randomRouter)
app.use(express.static(__dirname+'/public'));

io.on('connection', socket=>{

    socket.on('messagereq',async()=>{
        const log= await Messages1.getAllMessages();
        io.emit('log',log)
    })

    socket.on('message',async(data)=>{
        let log= await Messages1.getAllMessages();
        data.id=Object.keys(log.entities.messages).length+1
        await Messages1.addNewMessage(data);
        log= await Messages1.getAllMessages();
        io.emit('log',log)
    }) 
      
    socket.on('test',async()=>{
        const logtest = await testProducts.getTest();
        io.emit('logtest',logtest)
    }) 

    socket.on('Charreq',async()=>{
        const logchar = await Messages1.getAllCharacters()
        io.emit('logchar',logchar) 
    })

    socket.on('characters',async(datachar)=>{
        await Messages1.addNewCharacter(datachar)
        const logchar= await Messages1.getAllCharacters()
        io.emit('logchar',logchar)
    })

})