const Profile=require("../models/profile");

const cacheTime=10*60*1000;
const cache={};

async function getJson(url,options={})
{
    let res=await fetch(url,{...options,signal:AbortSignal.timeout(7000)});
    if(!res.ok){
        throw new Error("bad status "+res.status);
    }
    return res.json();
}

module.exports.github=async (req,res,next)=>{
    try{
        let cached=cache.github;
        if(cached&&Date.now()-cached.time<cacheTime){
            return res.json(cached.data);
        }
        let profile=await Profile.getProfile();
        let username=profile.github.username;
        let data={repos:null,followers:null,contributions:null,levels:[]};

        try{
            let user=await getJson("https://api.github.com/users/"+username,{headers:{"User-Agent":"portfolio"}});
            data.repos=user.public_repos;
            data.followers=user.followers;
        }
        catch(err){
            console.log("github user failed",err.message);
        }

        try{
            let result=await getJson("https://github-contributions-api.jogruber.de/v4/"+username+"?y=last");
            data.contributions=result.contributions.reduce((sum,day)=>sum+day.count,0);
            data.levels=result.contributions.slice(-203).map((day)=>day.level);
        }
        catch(err){
            console.log("github contributions failed",err.message);
        }

        if(data.repos!==null){
            cache.github={time:Date.now(),data:data};
        }
        res.json(data);
    }
    catch(err){
        next(err);
    }
};

module.exports.leetcode=async (req,res,next)=>{
    try{
        let cached=cache.leetcode;
        if(cached&&Date.now()-cached.time<cacheTime){
            return res.json(cached.data);
        }
        let profile=await Profile.getProfile();
        let username=profile.leetcode.username;
        let data={solved:null,total:null,easy:null,medium:null,hard:null};

        try{
            let query="query($username:String!){allQuestionsCount{difficulty count} matchedUser(username:$username){submitStatsGlobal{acSubmissionNum{difficulty count}}}}";
            let result=await getJson("https://leetcode.com/graphql",{
                method:"POST",
                headers:{"Content-Type":"application/json","Referer":"https://leetcode.com"},
                body:JSON.stringify({query:query,variables:{username:username}})
            });
            let solvedList=result.data.matchedUser.submitStatsGlobal.acSubmissionNum;
            let totalList=result.data.allQuestionsCount;
            let find=(list,level)=>list.find((item)=>item.difficulty===level).count;
            data={
                solved:find(solvedList,"All"),
                total:find(totalList,"All"),
                easy:{solved:find(solvedList,"Easy"),total:find(totalList,"Easy")},
                medium:{solved:find(solvedList,"Medium"),total:find(totalList,"Medium")},
                hard:{solved:find(solvedList,"Hard"),total:find(totalList,"Hard")}
            };
            cache.leetcode={time:Date.now(),data:data};
        }
        catch(err){
            console.log("leetcode failed",err.message);
        }
        res.json(data);
    }
    catch(err){
        next(err);
    }
};
