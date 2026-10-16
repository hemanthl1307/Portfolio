const fs=require("fs").promises;
const path=require("path");
const ExpressError=require("../ExpressError");

async function getProfile()
{
    try{
        let text=await fs.readFile(path.join(__dirname,"../data/profile.json"),"utf8");
        return JSON.parse(text);
    }
    catch(err){
        throw new ExpressError(500,"Profile data could not be read");
    }
}

module.exports={getProfile};
