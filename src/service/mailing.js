import mailer from 'nodemailer';

export default class MailingService{
    constructor(){
        this.client=mailer.createTransport({
            service:'gmail',
            port:587,
            auth:{
                user:process.env.EMAIL_ADDRESS,
                pass:process.env.EMAIL_PASSWORD,
            }
        })
    }
    sendSimpleMAil=async({from,to,subject,html,attachments=[]})=>{
        let result= await this.client.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        })
        return result;
    }
}