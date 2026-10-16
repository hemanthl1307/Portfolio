const themeBtn=document.getElementById("themeBtn");
const popup=document.getElementById("popup");
const popupBox=document.getElementById("popupBox");

function setTheme(mode)
{
    document.body.classList.toggle("light",mode==="light");
    themeBtn.textContent=mode==="light"?"☾ Dark":"☀ Light";
    try{
        localStorage.setItem("theme",mode);
    }
    catch(err){}
}

let savedTheme="dark";
try{
    savedTheme=localStorage.getItem("theme")||"dark";
}
catch(err){}
setTheme(savedTheme);

themeBtn.addEventListener("click",function(){
    setTheme(document.body.classList.contains("light")?"dark":"light");
});

function showPopup(type,title,text)
{
    popupBox.className="popup-box "+type;
    document.getElementById("popupTitle").textContent=title;
    document.getElementById("popupText").textContent=text;
    popup.classList.add("show");
}

document.getElementById("popupClose").addEventListener("click",function(){
    popup.classList.remove("show");
});
popup.addEventListener("click",function(e){
    if(e.target===popup){
        popup.classList.remove("show");
    }
});

function startTyping(roles)
{
    const typed=document.getElementById("typed");
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        typed.textContent=roles.join(" | ");
        return;
    }
    let roleIndex=0;
    let charIndex=0;
    let deleting=false;
    function tick()
    {
        let word=roles[roleIndex];
        charIndex=deleting?charIndex-1:charIndex+1;
        typed.textContent=word.substring(0,charIndex);
        let delay=deleting?50:100;
        if(!deleting&&charIndex===word.length){
            deleting=true;
            delay=1400;
        }
        else if(deleting&&charIndex===0){
            deleting=false;
            roleIndex=(roleIndex+1)%roles.length;
            delay=400;
        }
        setTimeout(tick,delay);
    }
    tick();
}

function diffLine(sign,text)
{
    return `<div class="line ${sign==="+"?"add":"del"}"><span>${sign}</span><span>${text}</span></div>`;
}

function pills(list)
{
    return list.map(function(item){
        return `<span class="pill">${item}</span>`;
    }).join("");
}
function linksRow(links)
{
    let html = "";
    links.forEach(function (l)
    {
        let extra = l.href.startsWith("mailto:") ? "" : ' target="_blank" rel="noopener"';
        html += `<a href="${l.href}"${extra}>${l.label}</a>`;
    });
    return `<div class="line bold find-head"><span>## Find me</span></div><div class="card-links">${html}</div>`;
}
function renderHero(p)
{
    document.title=p.name+" | Portfolio";
    document.getElementById("brandName").textContent=p.name;
    document.getElementById("heroTitle").innerHTML=p.heroTitle;
    document.getElementById("heroTagline").textContent=p.tagline;
    document.getElementById("heroGithub").href=p.github.url;
    document.getElementById("heroCard").innerHTML=`
        <div class="card-top">
            <div class="avatar">${p.initials}<img src="${p.photo}" alt="${p.name}" onerror="this.remove()"></div>
            <div><h3>${p.name}</h3><p>${p.role}</p></div>
            <span class="badge green">${p.status}</span>
        </div>
        <div class="file-head"><b>README.md</b><span><i class="a">+1</i> <i class="d">-1</i></span></div>
        <div class="hunk">@@ about me @@</div>
        <div class="line bold"><span>## Hi, I'm ${p.shortName}</span></div>
        ${diffLine("-",p.about.removed)}
        ${diffLine("+",p.about.added)}
        <p class="code-text">${p.about.text}</p>
        ${linksRow(p.links)}
    `;
    startTyping(p.roles);
}

function renderSkills(p)
{
    let rows=p.skills.map(function(group){
        return `<div class="skill-row ${group.highlight?"add":""}">
            <span class="label">${group.highlight?"+ ":""}${group.label}</span>
            <div class="pills">${pills(group.items)}</div>
        </div>`;
    }).join("");
    let count=p.skills.filter(function(g){return g.highlight}).reduce(function(sum,g){return sum+g.items.length},0);
    document.getElementById("skillsCard").innerHTML=`
        <div class="file-head first"><b>skills.md</b><span><i class="a">+${count}</i></span></div>
        <div class="hunk">@@ stack @@</div>
        ${rows}
    `;
}

function renderProjects(p)
{
    document.getElementById("projectList").innerHTML=p.projects.map(function(item){
        let added=item.added.map(function(line){
            return diffLine("+",line);
        }).join("");
        let live=item.liveUrl
            ?`<a class="btn-sm" href="${item.liveUrl}" target="_blank">Live demo</a>`
            :`<span class="btn-sm off">Live demo soon</span>`;
        return `<div class="card project">
            <div class="project-top">
                <div class="project-title">
                    <h3>${item.title}</h3>
                    <span class="badge ${item.status==="Open"?"green":"purple"}">&#9679; ${item.status}</span>
                </div>
                <p>${item.description}</p>
            </div>
            <div class="file-head"><b>project.md</b><span><i class="a">+${item.added.length}</i> <i class="d">-1</i></span></div>
            ${diffLine("-",item.removed)}
            ${added}
            <div class="project-bottom">
                <div class="pills">${pills(item.tech)}</div>
                <div class="project-btns"><a class="btn-sm" href="${item.codeUrl}" target="_blank">View code</a>${live}</div>
            </div>
        </div>`;
    }).join("");
}

function renderAcademics(p)
{
    let rows=p.academics.map(function(item){
        return `<div class="log-row">
            <span class="dot"></span>
            <div>
                <div class="hash">${item.hash}</div>
                <div class="log-title">${item.title}</div>
                <div class="log-sub">${item.sub}</div>
            </div>
            <span class="log-date">${item.date}</span>
        </div>`;
    }).join("");
    document.getElementById("logCard").innerHTML=`
        <div class="file-head first"><b>achievements.log</b><span>${p.academics.length} entries</span></div>
        ${rows}
    `;
}

function renderOnline(p)
{
    let heat="";
    for(let i=0;i<203;i++){
        heat+=`<div class="lv0"></div>`;
    }
    document.getElementById("githubCard").innerHTML=`
        <div class="file-head first"><b>github.com/${p.github.username}</b><b>profile.md</b></div>
        <div class="profile-row">
            <div class="avatar">${p.initials}</div>
            <div><h3>@${p.github.username}</h3><p>${p.name}</p></div>
            <a class="btn-sm" href="${p.github.url}" target="_blank">Open profile</a>
        </div>
        <div class="stats">
            <div class="stat"><b id="ghRepos">--</b><span>Repositories</span></div>
            <div class="stat"><b id="ghFollowers">--</b><span>Followers</span></div>
            <div class="stat"><b id="ghContrib">--</b><span>Contributions</span></div>
        </div>
        <div class="heat-wrap"><div class="heat" id="heat">${heat}</div></div>
        <div class="legend">Less <i class="lv0"></i><i class="lv1"></i><i class="lv2"></i><i class="lv3"></i><i class="lv4"></i> More</div>
    `;
    document.getElementById("leetcodeCard").innerHTML=`
        <div class="file-head first"><b>leetcode.com/u/${p.leetcode.username}</b><b>profile.md</b></div>
        <div class="profile-row">
            <div class="avatar">${p.initials}</div>
            <div><h3>@${p.leetcode.username}</h3><p>Problem solving</p></div>
            <a class="btn-sm" href="${p.leetcode.url}" target="_blank">Open profile</a>
        </div>
        <div class="lc-body">
            <div class="ring">
                <svg viewBox="0 0 100 100">
                    <circle class="track" cx="50" cy="50" r="42"></circle>
                    <circle class="progress" id="lcRing" cx="50" cy="50" r="42"></circle>
                </svg>
                <div class="ring-text"><b id="lcSolved">--</b><small>solved</small></div>
            </div>
            <div class="bars">
                <div class="bar-row"><div class="bar-top"><span>Easy</span><span id="lcEasyText">-- / --</span></div><div class="bar"><span class="easy" id="lcEasyBar"></span></div></div>
                <div class="bar-row"><div class="bar-top"><span>Medium</span><span id="lcMediumText">-- / --</span></div><div class="bar"><span class="medium" id="lcMediumBar"></span></div></div>
                <div class="bar-row"><div class="bar-top"><span>Hard</span><span id="lcHardText">-- / --</span></div><div class="bar"><span class="hard" id="lcHardBar"></span></div></div>
            </div>
        </div>
    `;
}

function fillGithub(d)
{
    if(d.repos!==null){
        document.getElementById("ghRepos").textContent=d.repos;
        document.getElementById("ghFollowers").textContent=d.followers;
    }
    if(d.contributions!==null){
        document.getElementById("ghContrib").textContent=d.contributions;
        let cells=document.getElementById("heat").children;
        d.levels.forEach(function(level,i){
            if(cells[i]){
                cells[i].className="lv"+level;
            }
        });
    }
}

function fillLeetcode(d)
{
    if(d.solved===null){
        return;
    }
    document.getElementById("lcSolved").textContent=d.solved;
    let circle=2*Math.PI*42;
    let ring=document.getElementById("lcRing");
    ring.style.strokeDasharray=circle;
    ring.style.strokeDashoffset=circle*(1-d.solved/d.total);
    ["easy","medium","hard"].forEach(function(level){
        let name=level.charAt(0).toUpperCase()+level.slice(1);
        document.getElementById("lc"+name+"Text").textContent=d[level].solved+" / "+d[level].total;
        document.getElementById("lc"+name+"Bar").style.width=(d[level].solved/d[level].total*100)+"%";
    });
}

function renderContact(p)
{
    let lines=[];
    if(p.contact.email){
        lines.push(p.contact.email);
    }
    lines.push(p.github.url.replace("https://",""));
    lines.push(p.leetcode.url.replace("https://",""));
    document.getElementById("replyTime").textContent="I usually reply within "+p.contact.replyTime+".";
    document.getElementById("otherWays").innerHTML=lines.map(function(line){
        return diffLine("+",line);
    }).join("");
    document.getElementById("footerName").textContent=p.name;
}

const form=document.getElementById("messageForm");
const sendBtn=document.getElementById("sendBtn");

form.addEventListener("submit",async function(e){
    e.preventDefault();
    let name=form.elements["name"].value.trim();
    sendBtn.disabled=true;
    sendBtn.textContent="Sending...";
    try{
        await api.sendMessage({
            name:name,
            email:form.elements["email"].value.trim(),
            message:form.elements["message"].value.trim()
        });
        showPopup("success","Message sent","Thanks "+name+", your message reached me. I will reply by email.");
        form.reset();
    }
    catch(err){
        showPopup("error","Could not send",err.message);
    }
    finally{
        sendBtn.disabled=false;
        sendBtn.textContent="Send message";
    }
});

async function init()
{
    try{
        let profile=await api.getProfile();
        renderHero(profile);
        renderSkills(profile);
        renderProjects(profile);
        renderAcademics(profile);
        renderOnline(profile);
        renderContact(profile);
    }
    catch(err){
        showPopup("error","Page could not load",err.message);
        return;
    }
    api.getGithub().then(fillGithub).catch(function(err){console.log(err.message)});
    api.getLeetcode().then(fillLeetcode).catch(function(err){console.log(err.message)});
}

init();
