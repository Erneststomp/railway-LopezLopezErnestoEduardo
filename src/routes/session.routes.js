import { Router } from "express";
import passport from "passport";
import config from "../models/config/config.js";
import jwt from 'jsonwebtoken'
import MailingService from "../service/mailing.js";
import userService from "../public/users.js";
import { createHash } from "../utils.js";
import isAutenticated from '../middleware/isautenticated.js'
import validator from "validator";


const router= Router();
//mediante passport se realiza el registro de los datos del nuevo usuario, enc aso de que exista un error, se enviara un mensaje de error indicando el motivo.
//al registrarse un usuario, se genera un carrito nuevo con el id del email
router.post('/register', (req, res, next) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required' });
  }
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  next();
}, passport.authenticate('register', { failureRedirect: '/registerfail', failureFlash: true }), async(req, res) => {
  res.send({ status: 'success', message: 'The account was created successfully' });
});

//mediante passport se realiza el inciio de sesion del usuario previamente registrado
router.post('/login', (req, res, next) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).send({ status: "error", message: "email and password are required" });
  }
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  next();
}, passport.authenticate('login', { failureRedirect: '/loginfail', failureFlash: true }), async(req, res) => {
  req.session.user={
      id:req.user.id,names:req.user.names, lastname:req.user.lastnames,age:req.user.age,avatar:req.user.avatar,alias:req.user.alias
  }
  res.send({status:"success", message:`You are now loged`})
});
//se destruye la sesion 
router.post('/logout',isAutenticated, async(req,res)=>{
  req.session.destroy()
  res.send({status:"Logout", message:"Your session is closed" })
})

//la cuenta es borrada de la base de datos, mediante la implementacion de passport, al mismo tiempo el carrito unico que cuenta con id del correo se elimina tambien
router.delete('/deleteaccount', isAutenticated, async (req, res, next) => {
  const { id, password } = req.body;
  if (!id || !password) {
    return res.status(400).send({ status: 'error', error: 'Missing credentials' });
  }
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  next();
}, passport.authenticate('deleteaccount',{failureRedirect:'/deleteaccountfail',failureFlash: true}), async(req,res)=>{
  res.send({status:"success", message:"The account was deleted"})
});

//si no se recuerda la contraseña, se enviara un token para el reestablecimiento, mediante email, para poder registrar una nueva
router.post('/recover', async(req,res)=>{
  const {id}=req.body;
  const restoreURL=config.url.mainurl
  if (!validator.isEmail(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' });
  }
  const recoveryToken=jwt.sign({id},'Nosequeponer01',{expiresIn:600})
  const mailer = new MailingService();
  //verifica que la cuenta exista, antes de enviar un correo de recuperacion
  let user=await userService.findOne({id:id})
  if(!user) return res.send({status:"error",error:"There is no user with this email, please verify or register"})
  let result=await mailer.sendSimpleMAil({
    from: process.env.EMAIL_ADDRESS,
    to: id, 
    subject:'Restore Pasword',
    html:`<div>
    <h1>To restore your password, please </h1>
    <p>De click en el siguiente enlace</p> 
    <a href="${restoreURL}/restore?tkn=${recoveryToken}">Reestablecer</a>
    <p>Cuando lo use en Postman, recuerde que debe enviar el token y el newPassword como parametros a la ruta /resore con un POST</p>
    <p>Su token es: </p>
    <p>${recoveryToken}</p>
    </div>`
  })
  res.send({status:'success',message:"Recovery message sent"})
})
//una vez que se haya recibido el token con el email que fue enviado, se procede a modificar la contraseña, emdiante la verificacion del token, el cual debe ser enviado como objeto cunto al newPAssword
router.put('/restore', async(req, res) => {
  try{
    let{newPassword,token}=req.body
    let {id}=jwt.verify(token,'Nosequeponer01');
    let user=await userService.findOne({id:id})
    if(!user) return res.send({status:"error",error:"Invalid Token"})
    user.password=createHash(newPassword)
    let result=await userService.findByIdAndUpdate(user._id,{$set:{password:user.password}})
    res.send({status:"success",message:'pasword changed'})
  }
  catch (error){
    if(error.expiredAt){
      res.send({status:"error",error:"token expired"})
    }else{
      console.log(error)
    }
  }   
})


export default router;  