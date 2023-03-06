import passport from "passport";
import local from 'passport-local';
import userService from "../../public/users.js";
import { createHash } from "../../utils.js";
import { validatePassword } from "../../utils.js";
import {cartsController} from '../../controllers/carts.controller.js'
import MailingService from "../../service/mailing.js";

const localStrategy=local.Strategy;

const initializePassport=()=>{
    //se procede a realizar el registro del usuario nuevo
    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'id'},
    async(req,id,password,done)=>{
        try{
            //se  reciben los datos desde el body 
            const {names,lastname,age,avatar,alias,phone,adress,CountryCode}=req.body
            //se suma el codigo del area al numero de telefono para generar la cadena completa
            let Phone= CountryCode+phone;
            if(!names||!id||!lastname||!age||!avatar||!alias||!Phone||!adress)return done(null, false, {message:"All fields are needed"})
            //se verifica que la edad sea numerica, s no, se envia una advertencia 
            let typeofage=parseInt(age)
            if(isNaN(typeofage))return done(null, false, {message:"Age must be a number"})
            //se verifica que no exista un usuario con el mismo email
            const exist =await userService.findOne({id:id})
            if(exist) return done(null,false,{message:"User already exist"})
            //se verifica que no exista un usuario con el mismo alias
            const existAlias =await userService.findOne({alias:alias})
            if(existAlias) return done(null,false,{message:"The alsias is taken"})
            //se genera el nuevo usuario y se realiza el hasheo de la contraseña
            const newUSer={
                id,names,lastname,age,avatar,alias,Phone,adress,
                password:createHash(password)
            } 
            //se crea el suusario en mongo
            let result=await userService.create(newUSer)
            //se crea el carrito personal del usuario
            let newcart=await cartsController.addNewCartPersonal(req, id)
            //se envia un email para informar que el usuario fue creado
            const mailer = new MailingService();
            //se establece por defecto dos destinatariosm el admin cuyos datos estan en las variables de entorno y el que se registra, a ambos se les informa del registro exitoso
            let destinatarios=[id,process.env.EMAIL_ADDRESS]
            let resultEmail=await mailer.sendSimpleMAil({
                from: process.env.EMAIL_ADDRESS,
                to: destinatarios,
                subject:'Register confirmation',
                html:`<div>
                <h1>The user has been registered </h1>
                <p>${id}</p>
                </div>`
            })
            return done(null,result)
        }
        catch(error){
            done(error)
        }
    })) 

    //se realiza la verificacion de credenciales para el inciio de sesion
    passport.use('login',new localStrategy({usernameField:'id'},
    async(id,password,done)=>{
        try{
            //verifica que los dos datos sean enviados
            if(!id||!password)return done(null, false, {message:"All fields are needed"})
            const user =await userService.findOne({id:id})
            //verifica que exista el email
            if(!user) return done(null, false,{message:"There is no user with this email, please verify or register"})
            //verifica que la contraseña corresponga a la contraseña haseada
            if(!validatePassword(user,password)) return done(null,false,{message:'Incorrect Password'})
            return done(null,user)
        }
        catch(error){
            done(error)
        }
    }))


    //se elimina la cuenta
    passport.use('deleteaccount',new localStrategy({usernameField:'id'},
    async(id,password,done)=>{
        try{
            //verifica que los dos datos sean enviados
            if(!id||!password)return done(null, false, {message:"All fields are needed"})
            const user =await userService.findOne({id:id})
            //verifica que exista el usuario para pdoer eliminarlo
            if(!user) return done(null, false,{message:"There is no user with this email"})
            //verifica la contraseña
            if(!validatePassword(user,password)) return done(null,false,{message:'Incorrect Password'})
            //elimina el suuario de la base de datos
            let result=await userService.deleteOne(user);
            //elimina el carrito
            let newcart = await cartsController.deletePersonalCartById(id);
            return done(null,user)
        }
        catch(error){
            done(error)
        }
    }))


    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let result=await userService.findOne({_id:id})
        return done(null,result)
    })
}

export default initializePassport