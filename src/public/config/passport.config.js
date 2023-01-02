import passport from "passport";
import local from 'passport-local';
import userService from "../users.js";
import { createHash } from "../../utils.js";
import { validatePassword } from "../../utils.js";
import GithubStrategy from 'passport-github2'; 
const localStrategy=local.Strategy;
const initializePassport=()=>{
    
    passport.use('register',new localStrategy({passReqToCallback:true,usernameField:'id'},
    async(req,id,password,done)=>{
        try{
            const {names,lastname,age,avatar,alias}=req.body
            if(!names||!id||!lastname||!age||!avatar||!alias)return done(null,false,{message:"All fields are needed"})
            const exist =await userService.findOne({id:id})
            if(exist) return done(null,false,{message:"User already exist"})
            const newUSer={
                id,names,lastname,age,avatar,alias,
                password:createHash(password)
            }
            let result=await userService.create(newUSer)
            return done(null,result)
        }
        catch(error){
            done(error)
            console.log(error)
        }
    }))

    passport.use('login',new localStrategy({usernameField:'id'},
    async(id,password,done)=>{
        try{
            if(!id||!password)return done(null, false, {message:"All fields are needed"})
            const user =await userService.findOne({id:id})
            if(!user) return done(null, false,{message:"There is no user with this email, please verify or register"})
            if(!validatePassword(user,password)) return done(null,false,{message:'Incorrect Password'})
           
            return done(null,user)
        }
        catch(error){
            done(error)
            console.log(error)
        }
    }))
  

    passport.use('github',new GithubStrategy({
        clientID:'Iv1.9817d55c20e6d34d',
        clientSecret:'1bd432c5feff843d2085ff23660563ff5dc3bb05',
        callbackURL:'/githubcallback',
    }, async (accessToken,refreshToken,profile,done)=>{
        console.log(profile)
        const{name, avatar_url, email, login}=profile._json
        if(!email)return done(null,false,{message:'Your Github Account has a private email'})
        let user =await userService.findOne({id:email})
        if (!user){
            let newUser={
                names:name,
                lastname:'',
                avatar:avatar_url,
                id:email,
                alias:login,
                password:'',
                age:18
            }
            let result=await userService.create(newUser)
            return  done(null,result)
        }
        else{
            return done(null,user)
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