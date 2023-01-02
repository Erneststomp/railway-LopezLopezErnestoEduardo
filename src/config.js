import dotenv from 'dotenv';

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
        urlmongo:"mongodb+srv://ernest:1234567890@cluster0.4pjly21.mongodb.net/Users?retryWrites=true&w=majority"
    }
}  