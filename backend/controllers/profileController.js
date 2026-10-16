const Profile=require("../models/profile");

module.exports.getProfile=async (req,res,next)=>{
    try{
        let profile=await Profile.getProfile();
        res.json(profile);
    }
    catch(err){
        next(err);
    }
};
