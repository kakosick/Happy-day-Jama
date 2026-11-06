/* ===== secret star ===== */
let hits=0;
$("#star").onclick=()=>{hits++;$("#star").style.transform=`scale(${1+hits*.6})`;
  if(hits>=3){hits=0;$("#star").style.transform="";$("#secret").classList.add("show");burst=70;$("#sclose").focus()}};
$("#sclose").onclick=()=>$("#secret").classList.remove("show");
addEventListener("keydown",e=>{if(e.key==="Escape")$("#secret").classList.remove("show")});

/* ===== particles ===== */
const cv=$("#fx"),cx=cv.getContext("2d");let W,H,ps=[],burst=0;
const size=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};size();addEventListener("resize",size);
const mk=()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.4,v:Math.random()*.25+.05,a:Math.random()*.5+.15});
for(let i=0;i<(innerWidth<600?24:48);i++)ps.push(mk());
(function loop(){cx.clearRect(0,0,W,H);
  if(burst>0&&ps.length<260){for(let i=0;i<4;i++){const p=mk();p.y=H+10;p.v*=5;ps.push(p)}burst--}
  ps.forEach((p,i)=>{if(!reduce)p.y-=p.v;if(p.y<-5){if(ps.length>70){ps.splice(i,1);return}p.y=H+5;p.x=Math.random()*W}
    cx.fillStyle=`rgba(213,191,193,${p.a})`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.3);cx.fill()});
  requestAnimationFrame(loop)})();


