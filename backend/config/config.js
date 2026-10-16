require("dotenv").config();

module.exports={
    port:process.env.PORT||8080,
    emailUser:process.env.EMAIL_USER,
    emailPass:process.env.EMAIL_PASS,
    emailTo:process.env.EMAIL_TO||process.env.EMAIL_USER
};