import {transporter} from '../config/mail.js'
export const sendTestMail=async(req,res)=>{
    try{
     await transporter.sendMail({
        from:process.env.EMAIL_USER,
       to: process.env.EMAIL_USER,
        subject:"OrganizeNotes Test Mail",
        text:"Email setup is working successfully ."
     })
      console.log("Email Sent Successfully");
    }catch(err){
      console.log(err);
    }
}