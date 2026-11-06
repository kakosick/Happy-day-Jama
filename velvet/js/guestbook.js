(() => {
  const f = document.getElementById("gbForm"); if (!f) return;
  const st = document.getElementById("gbStatus"), btn = document.getElementById("gbSend");
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const message = document.getElementById("gbM").value;   // stored exactly as written
    const name = document.getElementById("gbN").value.trim() || "Yuki";
    if (!message.trim()) { st.textContent = tr("gbEmpty"); return; }
    if (!sb) { st.textContent = tr("gbNoCfg"); return; }
    btn.disabled = true; st.textContent = "";
    try {
      const { error } = await sb.from("messages").insert({ name, message });
      if (error) throw error;
      f.hidden = true; document.getElementById("gbOk").hidden = false;
    } catch (err) { console.error(err); st.textContent = tr("gbErr"); btn.disabled = false; }
  });
})();
