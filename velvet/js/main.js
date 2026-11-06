let T,PLAYLIST;
const PHOTO="assets/images/photo.jpg";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let lang="en";try{lang=localStorage.getItem("velvet-lang")||"en"}catch(e){}

const tr=k=>T[lang][k];

function applyLang(){
  document.documentElement.lang=lang;
  $$("[data-t]").forEach(e=>e.textContent=tr(e.dataset.t));
  $$(".lang button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.l===lang));
  $("#secret em").textContent=tr("secretExtra");
  $("#pp").setAttribute("aria-label",audio.paused?tr("play"):tr("pause"));
  $("#envbtn").setAttribute("aria-label",$("#envbtn").getAttribute("aria-expanded")==="true"?tr("shut"):tr("open"));
  if(typed===null)$("#paper").textContent=opened?tr("letter"):"";
  else{clearInterval(typed);typed=null;$("#paper").classList.remove("cursor");if(opened)$("#paper").textContent=tr("letter")}
}
$$(".lang button").forEach(b=>b.onclick=()=>{lang=b.dataset.l;try{localStorage.setItem("velvet-lang",lang)}catch(e){}applyLang()});

/* ===== intro ===== */
const seq=(id,ms)=>setTimeout(()=>{const e=$(id);e.style.display="block";e.offsetWidth;e.classList.add("on")},ms);
setTimeout(()=>$("#ring").classList.add("off"),1400);
seq("#i1",1700);
setTimeout(()=>{$("#i1").classList.remove("on");$("#i1").style.display="none"},4200);
seq("#i2",4500);seq("#i3",5400);
setTimeout(()=>{const e=$("#enter");e.style.display="inline-block";e.offsetWidth;e.classList.add("on")},6300);
$("#enter").onclick=()=>{
  $("#intro").classList.add("gone");document.body.classList.remove("lock");$("#nav").style.opacity=1;
  setTimeout(()=>$("#welcome").scrollIntoView({behavior:reduce?"auto":"smooth"}),500);
};
$("#intro").addEventListener("keydown",e=>{});

/* ===== reveal ===== */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
$$(".rv").forEach((e,i)=>{e.style.transitionDelay=(i%3)*.12+"s";io.observe(e)});

/* ===== photo ===== */
const img=new Image();img.onload=()=>{$("#ph").style.backgroundImage=`url(${PHOTO})`;$("#phEmpty").style.display="none"};img.src=PHOTO;
$("#phFile").onchange=e=>{const f=e.target.files[0];if(!f)return;$("#ph").style.backgroundImage=`url(${URL.createObjectURL(f)})`;$("#phEmpty").style.display="none"};

/* ===== letter ===== */
let opened=false,typed=null;
$("#envbtn").onclick=()=>{
  opened=!opened;$("#env").classList.toggle("open",opened);$("#envbtn").setAttribute("aria-expanded",opened);
  $("#envbtn").setAttribute("aria-label",opened?tr("shut"):tr("open"));
  const p=$("#paper");clearInterval(typed);typed=null;p.classList.remove("cursor");
  if(!opened){p.classList.remove("show");return}
  p.classList.add("show");const txt=tr("letter");
  if(reduce){p.textContent=txt;return}
  p.textContent="";p.classList.add("cursor");let n=0;
  typed=setInterval(()=>{p.textContent=txt.slice(0,++n);if(n>=txt.length){clearInterval(typed);typed=null;p.classList.remove("cursor")}},38);
};


async function init(){
  try{[T,PLAYLIST]=await Promise.all([fetch("data/content.json").then(r=>r.json()),fetch("data/playlist.json").then(r=>r.json())])}
  catch(e){document.body.insertAdjacentHTML("afterbegin",'<p style="position:fixed;z-index:99;top:1rem;left:1rem;right:1rem;background:#641E32;padding:1rem">Could not load data/*.json. Open the site through a local server (see README), not by double-clicking the file.</p>');return}
  if(!T[lang])lang="en";applyLang();initMusic();
}
init();
