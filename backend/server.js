const app=require("./app");
const config=require("./config/config");

app.listen(config.port,()=>{
    console.log("listening to the port",config.port);
});