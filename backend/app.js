const express=require("express");
const app=express();
const path=require("path");
const apiRoutes=require("./routes/api");
const ExpressError=require("./ExpressError");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"../frontend")));

app.use("/api",apiRoutes);

app.use("/api",(req,res,next)=>{
    next(new ExpressError(404,"API route not found"));
});

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="Some Error Occured"}=err;
    if(err.name==="ValidationError"){
        status=400;
        message="Please check the details you entered";
    }
    if(err.type==="entity.parse.failed"){
        message="Invalid data sent to the server";
    }
    if(status===500){
        console.log(err);
        message="Something went wrong on the server";
    }
    res.status(status).json({success:false,message:message});
});

module.exports=app;
