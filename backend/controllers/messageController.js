const sendMail=require("../mailer");
const ExpressError=require("../ExpressError");

module.exports.createMessage=async (req,res,next)=>{
    try{
        let name=String(req.body.name||"").trim();
        let email=String(req.body.email||"").trim();
        let message=String(req.body.message||"").trim();

        if(name.length<2||name.length>50){
            return next(new ExpressError(400,"Name must be between 2 and 50 characters"));
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>100){
            return next(new ExpressError(400,"Please enter a valid email"));
        }
        if(message.length<10||message.length>1000){
            return next(new ExpressError(400,"Message must be between 10 and 1000 characters"));
        }

        try{
            await sendMail({name,email,message});
        }
        catch(err){
            console.log("email failed",err.message);
            return next(new ExpressError(503,"Message could not be sent right now. Please try again later."));
        }
        res.status(201).json({success:true,message:"Message sent"});
    }
    catch(err){
        next(err);
    }
};