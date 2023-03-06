//Importacion de librerias
import express from "express";
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.routes.js'
import { Server } from "socket.io";
import testProducts from "./service/faker.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import initializePassport from "./models/config/passport.config.js";
import passport from "passport";
import flash from "express-flash";
import randomRouter from './routes/random.routes.js'
import config from "./models/config/config.js";
import productsRouter from './routes/products.routes.js' 
import sessionRouter from './routes/session.routes.js' 
import cartsRouter from './routes/cart.routes.js'
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./GraphQL/typedDefs.js";
import resolvers from "./GraphQL/resolvers.js";
import { chatDAO } from "./dao/chat/index.js";
import cartspersonalRouter from "./routes/personalcart.routes.js";

// Creación de la instancia de la aplicación Express
const app =express();
// Conexión a la base de datos MongoDB utilizando Mongoose
const connection =mongoose.connect(config.mongo.urlmongo)

// Establecimiento del puerto en el que el servidor escuchará las solicitudes
const PORT = config.app.PORT || 3000;
const server = app.listen(PORT,async()=>{
    console.log('Its Working')
});

// Creación de una instancia de Socket.io para habilitar la comunicación en tiempo real con los clientes
const io= new Server(server);
app.use(express.json());

// Configuración de Express para el manejo de sesiones utilizando MongoDB
app.use(session({
    store: MongoStore.create({
        mongoUrl:config.mongo.urlmongo,
        ttl:600
    }),
    secret: "nosequeponer000",
    resave:true,
    saveUninitialized:true,
})); 

// Middleware para mostrar mensajes flash
app.use(flash());

// Configuración de Passport y Express para el manejo de autenticación
app.use(passport.session());
initializePassport();
app.use(passport.initialize());

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

//Configuracion de las rutas
app.use(express.urlencoded({extended:true}));
app.use('/',viewsRouter);
app.use('/',sessionRouter)
app.use('/api/randoms', randomRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/carts',cartspersonalRouter)
app.use(express.static(__dirname+'/public'));

//configuracion de apoloserver(este no es parte de la entrega final, pero se deja)
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})
await apolloServer.start();
apolloServer.applyMiddleware({app})

//Declaraciones de Socket.io para el chat
io.on('connection', socket=>{
    socket.on('test',async()=>{
        const logtest = await testProducts.getTest();
        io.emit('logtest',logtest)
    }) 

    // socket.on('cartsredirect',async()=>{
    //     let destination = config.url.mainurl+'/api/carts';
    //     io.emit('cartredirect', destination);
    // })

    // socket.on('thispokemonredirect',async(id)=>{
    //     id=id.id+1
    //     let destination = config.url.mainurl+'/api/products/'+id;
    //     io.emit('pokemonredirect', destination); 
    // })

    socket.on('messagereq',async()=>{
        let log =  await chatDAO.getAll()
        io.emit('log',log)
    }) 

    socket.on('message',async(data)=>{
        const response = await chatDAO.getAll()
        await chatDAO.addItem(data)
        const log= await chatDAO.getAll()
        io.emit('log',log) 
    }) 

}
)