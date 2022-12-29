import { Router } from "express";
import passport from "passport";
const router= Router();

router.get('/', async(req,res)=>{
    if(req.session.user){
        let sesionUser=req.session.user
        res.render('chat.handlebars',{userData:sesionUser})
    }else{
        res.redirect('/login');
    }
})
router.post('/', async(req,res)=>{
    res.redirect('/logout');
})
router.post('/logout', async(req,res)=>{
    if(req.session.user){
        let sesionUser=req.session.user
        req.session.destroy()
        res.render('logout.handlebars',{userData:sesionUser})
        
    }else{
        res.redirect('/login');
    }    
})
router.get('/api/productos-test', async(req,res)=>{
    res.render('chattable.handlebars')
})
router.get('/login', async(req,res)=>{
    res.render('login.handlebars')
})
router.post('/login',passport.authenticate('login',{failureRedirect:'/loginfail',failureFlash: true}) ,async(req,res)=>{
    req.session.user={
        id:req.user.id,names:req.user.names, lastname:req.user.lastnames,age:req.user.age,avatar:req.user.avatar,alias:req.user.alias
    }
    res.redirect('/');
})

router.get('/loginfail', async(req,res)=>{
    res.render('loginfail.handlebars') 
})

router.get('/register', async(req,res)=>{
    res.render('register.handlebars')
})
router.post('/register', passport.authenticate('register',{successRedirect: '/',failureRedirect:'/registerfail'}), async(req,res)=>{
})

router.get('/registerfail', async(req,res)=>{
    res.render('registerfail.handlebars')
})

router.get('/github', passport.authenticate('github',{scope:[]}), async(req,res)=>{
    
})

router.get('/githubcallback', passport.authenticate('github'),async(req,res)=>{
    req.session.user={names:req.user.names,id:req.user.id,avatar:req.user.avatar,alias:req.user.alias,lastnanme:req.user.lastname,password:req.user.password,age:req.user.age}
    res.redirect('/');
})



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
    // [-] Memoria total reservada (rss)
    memoria:  ` ${Math.round( JSON.stringify(process.memoryUsage.rss())/ 1024 / 1024 * 100) / 100} MB`,
}


router.get('/info', async(req, res,) => {
    console.log('/info')
    const data = infodelProceso
    res.render('info', {data})
})

export default router;  