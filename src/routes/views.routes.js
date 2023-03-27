import { Router } from "express";
import {chatDAO} from '../dao/chat/index.js'
import isAutenticated from '../middleware/isautenticated.js'
import validator from "validator";
import userService from "../public/users.js";
import isLoged from '../middleware/isLoged.js'

const router= Router(); 

router.get('/', isLoged, async(req,res)=>{
  res.redirect('/api/products');
});


//se deja una vista con handlebars al login, ya que para entrar al chat es necesario el inicio de sesion, ya que es necesario por la implementacion de socket.
router.get('/login', async(req,res)=>{
  if(!req.session.user){
    res.render('login.handlebars')}
    else{
      res.redirect('/api/products')
    }
})
//se deja una vista con handlebars al register
router.get('/register', async(req,res)=>{
  res.render('register.handlebars')
})
//en caso de que no se pueda realizar el login, se envia un mensaje sobre el error que impidio el inciio de sesion
router.get('/loginfail', async(req, res) => {
  const errorMessage = req.flash('error')[0]; 
  res.send({status:"error",error:errorMessage})
});
//en caso de que no se pueda registrar un usuario, se envia un mensaje sobre el error que impidio el registro
router.get('/registerfail', async(req, res) => {
  const errorMessage = req.flash('error')[0];
  res.send({status:"error",error:errorMessage})
  
});
//en caso de que no sea posible recuperar la contraseña se enviara un mesaje que indicara la razon
router.get('/recoverfail', async(req,res)=>{
  const errorMessage = req.flash('error')[0];
  res.send({status:"error",error:errorMessage})
})
router.get('/restore', async(req, res,) => {
  res.render('recoverPassword.handlebars')
})

router.get('/restoreFail', async(req, res,) => {
  res.render('restoreFail.handlebars')
})

//se renderiza la planttilla de handlebars con el registro de los chats, esta es encesario ay que hace uso de socket.io
router.get('/chat',isAutenticated, async(req,res)=>{
    let sesionUser=req.session.user
    let chats =  await chatDAO.getAll()
    let chat = chats.map(char => {
      return {
          user: char.user,
          message: char.message,
          date: char.date,
      }
    })
    res.render('chat.handlebars',{userData:sesionUser,chats:chat})
})
//se renderiza una plantilla de handlebars con los mensajes provenientes unicamente del usuario con el email presente en :id
router.get('/chat/:id', isAutenticated, async (req, res) => {
  const sessionId = req.params.id;
  const allChats = await chatDAO.getAll();
  if (!validator.isEmail(sessionId )) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  let user=await userService.findOne({id:sessionId})
  if(!user) return res.send({status:"error",error:"There is no user with this email, please verify or register"})
  const chat = allChats.filter(chat => chat.user === sessionId)
    .map(chat => ({
      user: chat.user,
      message: chat.message,
      date: chat.date,
    }));
  res.render('chatpersonal.handlebars', { userData: req.session.user, chats: chat });
});


const infodelProceso = {
  // [-] Argumentos de entrada  
  args: process.argv.slice(2),
  // [-] Path de ejecución
  execPath: process.cwd(),
  // [-] Nombre de la plataforma (sistema operativo)      
  plataforma: process.platform,
  // [-] Process id
  processID: process.pid,
  // [-] Versión de node.js      
  nodeVersion: process.version,
  // [-] Carpeta del proyecto
  carpeta: process.argv[1],
  PORT:process.env.PORT,
  ProjectURL: process.env.URLGENERAL,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  URLMONGO: process.env.MongoURL,
  expirationTime:process.env.ExpirationTime,
  secret:process.env.secretstring,
  // [-] Memoria total reservada (rss)
  memoria:  ` ${Math.round( JSON.stringify(process.memoryUsage.rss())/ 1024 / 1024 * 100) / 100} MB`,
}

router.get('/info', async(req, res,) => {
  const data = infodelProceso
  res.render('info', {data})
})

export default router;   