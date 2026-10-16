async function request(url,options)
{
    let res;
    try{
        res=await fetch(url,options);
    }
    catch(err){
        throw new Error("Cannot reach the server. Please check your connection.");
    }
    let data=null;
    try{
        data=await res.json();
    }
    catch(err){
        data=null;
    }
    if(!res.ok){
        throw new Error(data&&data.message?data.message:"Something went wrong");
    }
    return data;
}

const api={
    getProfile:function(){
        return request("/api/profile");
    },
    getGithub:function(){
        return request("/api/stats/github");
    },
    getLeetcode:function(){
        return request("/api/stats/leetcode");
    },
    sendMessage:function(body){
        return request("/api/messages",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(body)
        });
    }
};
