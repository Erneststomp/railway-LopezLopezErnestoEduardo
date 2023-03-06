import dotenv from 'dotenv';
//se verifican si se ingresa como desarrollador o a produccion
const mode = process.argv.slice(2)[0];
dotenv.config({
    path:mode==="DEV"? './.env.development':'./.env.production'
}
);
export default   {
    app:{
        MODE: process.env.MODE || 'DEFAULT',
        HOST: process.env.HOST || 'localhost',
        PORT: process.env.PORT  || 8080
    },
    mongo:{
        urlmongo:process.env.MongoURL
    },
    url:{
        mainurl:process.env.URLGeneral
    }
}   