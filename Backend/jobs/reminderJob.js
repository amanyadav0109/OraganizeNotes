import cron from "node-cron";
import db from "../config/db.js";
import {transporter} from "../config/mail.js";

cron.schedule("* * * * *",()=>{
    console.log("checking reminder....");
    const sql=`SELECT n.*, u.email FROM notes n
    JOIN users u ON n.userId=u.id
    WHERE n.reminderSent=FALSE
    AND n.dueDate<=NOW()`;
    db.query(sql,async(err,results)=>{
        if(err){
            console.log("DB error",err.message);
            return;
        }
        console.log(results);
        for(let note of results){
             console.log("EMAIL:", note.email);
            try{
                await transporter.sendMail({
                    from:process.env.EMAIL_USER,
                    to:note.email,
                    subject:"Reminder:"+note.title,
                    text:`Your task is due:${note.content}`
                })
                const updateSql=`UPDATE notes 
                SET reminderSent=TRUE
                WHERE id=?`;
                db.query(updateSql,[note.id]);
            } catch(err){
                console.log("Email error:",err.message);
            }
        }
    })
})