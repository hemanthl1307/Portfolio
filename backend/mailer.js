const nodemailer=require("nodemailer");
const config=require("./config/config");

async function sendMail(data)
{
    if(!config.emailUser||!config.emailPass){
        throw new Error("email is not set in .env");
    }
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{user:config.emailUser,pass:config.emailPass}
    });
    await transporter.sendMail({
        from:config.emailUser,
        to:config.emailTo,
        replyTo:data.email,
        subject:"New portfolio message from "+data.name,
        text:"Name: "+data.name+"\nEmail: "+data.email+"\n\n"+data.message
    });
}

module.exports=sendMail;