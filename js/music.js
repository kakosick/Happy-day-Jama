const audio=new Audio();audio.preload="none";let idx=0;
function initMusic(){/* ===== music ===== */

const fmt=s=>isFinite(s)?Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0"):"0:00";
function buildList(){
  $("#pl").innerHTML="";
  PLAYLIST.forEach((t,i)=>{const li=document.createElement("li"),b=document.createElement("button");
    b.innerHTML=`<span></span><small></small>`;b.firstChild.textContent=t.title+" — "+t.artist;b.onclick=()=>{load(i);play()};
    li.appendChild(b);$("#pl").appendChild(li)});
}
function load(i){
  idx=(i+PLAYLIST.length)%PLAYLIST.length;const t=PLAYLIST[idx];
  audio.src=t.src;$("#empty").style.display="none";
  $("#tt").textContent=t.title;$("#ar").textContent=t.artist;
  $("#art").style.backgroundImage=t.art?`url(${t.art})`:"";$("#art").textContent=t.art?"":"♪";
  $$("#pl button").forEach((b,j)=>b.classList.toggle("on",j===idx));
  $("#fill").style.width="0";$("#cur").textContent="0:00";$("#dur").textContent="0:00";
}
function play(){audio.play().catch(()=>{$("#empty").style.display="block"})}
$("#pp").onclick=()=>audio.paused?play():audio.pause();
$("#next").onclick=()=>{const p=!audio.paused;load(idx+1);if(p)play()};
$("#prev").onclick=()=>{const p=!audio.paused;if(audio.currentTime>3)audio.currentTime=0;else{load(idx-1);if(p)play()}};
const setIcon=p=>{$("#ppi").innerHTML=p?'<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>':'<path d="M8 5v14l11-7z"/>';$("#pp").setAttribute("aria-label",p?tr("pause"):tr("play"));$("#player").classList.toggle("playing",p)};
audio.onplay=()=>setIcon(true);audio.onpause=()=>setIcon(false);audio.onended=()=>{load(idx+1);play()};
audio.onerror=()=>{$("#empty").style.display="block";setIcon(false)};
audio.onloadedmetadata=()=>$("#dur").textContent=fmt(audio.duration);
audio.ontimeupdate=()=>{const p=audio.duration?audio.currentTime/audio.duration*100:0;$("#fill").style.width=p+"%";$("#cur").textContent=fmt(audio.currentTime);$("#bar").setAttribute("aria-valuenow",Math.round(p))};
const seek=x=>{const r=$("#bar div").getBoundingClientRect();if(audio.duration)audio.currentTime=Math.min(1,Math.max(0,(x-r.left)/r.width))*audio.duration};
$("#bar").onclick=e=>seek(e.clientX);
$("#bar").onkeydown=e=>{if(e.key==="ArrowRight")audio.currentTime+=5;if(e.key==="ArrowLeft")audio.currentTime-=5};
buildList();load(0);

}
