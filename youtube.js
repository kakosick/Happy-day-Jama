/* VELVET — YouTube search for the music room (full version).
   Put this file in js/ as youtube.js and load it AFTER music.js. Needs YOUTUBE_API_KEY in js/config.js. */
(() => {
  const pl = document.getElementById("pl");
  if (!pl) return;
  const cfg = window.VELVET_CONFIG || {};
  const L = {
    en: { ph: "Search any song on YouTube…", go: "SEARCH", nokey: "Add YOUTUBE_API_KEY to js/config.js to search by name. You can already paste a YouTube link.", none: "Nothing found.", err: "Search failed. Check the key or try again later.", wait: "Searching…", bad: "This video can't be played here. Pick another result." },
    ru: { ph: "Найти любую песню на YouTube…", go: "НАЙТИ", nokey: "Добавь YOUTUBE_API_KEY в js/config.js, чтобы искать по названию. Ссылку на YouTube можно вставить уже сейчас.", none: "Ничего не найдено.", err: "Поиск не удался. Проверь ключ или попробуй позже.", wait: "Ищу…", bad: "Это видео нельзя проиграть на сайте. Выбери другой результат." }
  };
  const t = k => (L[typeof lang !== "undefined" && L[lang] ? lang : "en"])[k];

  let mode = "local";   // "local" = твои MP3, "yt" = YouTube
    let curBtn = null;

  const css = document.createElement("style");
  css.textContent = `
.yt{margin:0 0 1.4rem;max-width:26rem}
.ytf{display:flex;gap:.6rem}
.ytf input{flex:1;min-width:0;font:inherit;color:var(--ivory);background:rgba(50,19,31,.55);border:1px solid rgba(189,130,146,.3);border-radius:99px;padding:.7rem 1.1rem;min-height:48px}
.ytf .btn{padding:.7rem 1.2rem}
.ytm{font-size:.82rem;color:var(--rose);margin:.5rem .3rem;min-height:1.2em}
.ytr{list-style:none;padding:0;margin:0}
.ytr button{width:100%;display:flex;gap:.8rem;align-items:center;text-align:left;padding:.5rem .3rem;border-bottom:1px solid var(--wine);color:var(--pink);min-height:56px}
.ytr button:hover{color:var(--ivory)}
.ytr img{width:64px;height:48px;object-fit:cover;border-radius:3px;flex:none}
.ytr small{display:block;color:var(--rose)}
.ytp{margin:1rem 0;border-radius:4px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.6);aspect-ratio:16/9;width:100%}
.ytp iframe{display:block;width:100%;height:100%}`;
  document.head.appendChild(css);

  const box = document.createElement("div");
  box.className = "yt";
  box.innerHTML = '<form class="ytf" role="search"><input type="search" autocomplete="off" aria-label="YouTube"><button class="btn" type="submit"></button></form><p class="ytm" role="status" aria-live="polite"></p><div class="ytp" hidden><div id="ytplayer"></div></div><ul class="ytr"></ul>';
  pl.parentNode.insertBefore(box, pl);
  const inp = box.querySelector("input"), go = box.querySelector(".btn"), msg = box.querySelector(".ytm"),
    res = box.querySelector(".ytr"), wrap = box.querySelector(".ytp");

  const label = () => { inp.placeholder = t("ph"); go.textContent = t("go"); if (!cfg.YOUTUBE_API_KEY && !res.children.length) msg.textContent = t("nokey"); };
  label();
  document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", label));

  const decode = s => new DOMParser().parseFromString(s, "text/html").documentElement.textContent;
  const g = id => document.getElementById(id);

  let yt = null, apiReady = null;
  const api = () => apiReady || (apiReady = new Promise(ok => {
    if (window.YT && YT.Player) return ok();
    window.onYouTubeIframeAPIReady = ok;
    const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s);
  }));

  async function playVideo(id, title, artist, thumb) {
    await api();
    if (typeof audio !== "undefined") audio.pause();        // остановить локальный MP3
    mode = "yt";
    g("tt").textContent = title;
    g("ar").textContent = artist;
    const art = g("art");
    if (thumb) { art.style.backgroundImage = `url(${thumb})`; art.textContent = ""; }
    document.querySelectorAll("#pl button").forEach(b => b.classList.remove("on"));
    wrap.hidden = false;
    if (!yt) {
      yt = new YT.Player("ytplayer", {
        width: "100%", height: "100%", videoId: id,
        playerVars: { playsinline: 1, rel: 0, autoplay: 1 },
        events: {
          onStateChange: e => g("player").classList.toggle("playing", e.data === 1),
          onError: () => {
  const n = curBtn && curBtn.parentElement.nextElementSibling;
  if (n) n.querySelector("button").click(); else msg.textContent = t("bad");
}
        }
      });
    } else yt.loadVideoById(id);
  }

  // когда запускается MP3 — ставим YouTube на паузу
  if (typeof audio !== "undefined") audio.addEventListener("play", () => { mode = "local"; if (yt && yt.pauseVideo) yt.pauseVideo(); });

  async function search(q) {
    const u = new URL("https://www.googleapis.com/youtube/v3/search");
    Object.entries({ part: "snippet", type: "video", videoEmbeddable: "true", videoCategoryId: "10", maxResults: "6", q, key: cfg.YOUTUBE_API_KEY })
      .forEach(([k, v]) => u.searchParams.set(k, v));
    const r = await fetch(u);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return (await r.json()).items || [];
  }

  box.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();
    const q = inp.value.trim(); if (!q) return;
    res.textContent = "";
    const m = q.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);   // ссылка: ключ не нужен
    if (m) { msg.textContent = ""; curBtn = null; playVideo(m[1], "YouTube", "", `https://i.ytimg.com/vi/${m[1]}/default.jpg`); return; }
    if (!cfg.YOUTUBE_API_KEY) { msg.textContent = t("nokey"); return; }
    msg.textContent = t("wait"); go.disabled = true;
    try {
      const items = await search(q);
      msg.textContent = items.length ? "" : t("none");
      items.forEach(it => {
        const id = it.id.videoId, sn = it.snippet, title = decode(sn.title), ch = decode(sn.channelTitle);
        const thumb = sn.thumbnails.default.url;
        const li = document.createElement("li"), b = document.createElement("button"), img = document.createElement("img"), d = document.createElement("span");
        img.src = thumb; img.alt = ""; img.loading = "lazy";
        d.textContent = title; const s = document.createElement("small"); s.textContent = ch; d.appendChild(s);
        b.type = "button"; b.append(img, d); b.onclick = () => { curBtn = b; playVideo(id, title, ch, thumb); };
        li.appendChild(b); res.appendChild(li);
      });
    } catch (err) { console.error(err); msg.textContent = t("err"); }
    go.disabled = false;
  });

  /* ===== главные кнопки плеера управляют тем, что играет сейчас ===== */
  const mmss = s => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "0:00";
  const live = () => mode === "yt" && yt && yt.getPlayerState;
  g("pp").addEventListener("click", e => {
    if (!live()) return;
    e.stopImmediatePropagation();
    yt.getPlayerState() === 1 ? yt.pauseVideo() : yt.playVideo();
  }, true);
  g("prev").addEventListener("click", e => {
    if (!live()) return;
    e.stopImmediatePropagation();
    yt.seekTo(0, true);
  }, true);
  g("next").addEventListener("click", () => {
    if (mode === "yt") { mode = "local"; if (yt && yt.pauseVideo) yt.pauseVideo(); }
  }, true);
  g("bar").addEventListener("click", e => {
    if (!live()) return;
    e.stopImmediatePropagation();
    const r = g("bar").querySelector("div").getBoundingClientRect();
    yt.seekTo(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * yt.getDuration(), true);
  }, true);
  setInterval(() => {
    if (!live()) return;
    const d = yt.getDuration() || 0, c = yt.getCurrentTime() || 0, on = yt.getPlayerState() === 1;
    g("fill").style.width = (d ? c / d * 100 : 0) + "%";
    g("cur").textContent = mmss(c);
    g("dur").textContent = mmss(d);
    g("player").classList.toggle("playing", on);
    g("ppi").innerHTML = on ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
  }, 400);
})();
