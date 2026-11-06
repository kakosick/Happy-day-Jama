const $ = s => document.querySelector(s);
const show = on => { $("#login").hidden = on; $("#panel").hidden = !on; };
async function load() {
  const { data, error } = await sb.from("messages").select("id,name,message,created_at").order("created_at", { ascending: false });
  const ul = $("#list"); ul.textContent = "";
  if (error) { $("#note").textContent = "Could not load messages: " + error.message; return; }
  $("#count").textContent = data.length + " message(s)";
  $("#note").textContent = data.length ? "" : "No messages yet. If you expect some, check that your user is listed in the admins table (see README).";
  data.forEach(m => {
    const li = document.createElement("li"), n = document.createElement("b"), t = document.createElement("time"),
      p = document.createElement("p"), d = document.createElement("button");
    n.textContent = m.name; t.textContent = new Date(m.created_at).toLocaleString(); p.textContent = m.message;
    d.textContent = "Delete";
    d.onclick = async () => {
      if (!confirm("Delete this message permanently?")) return;
      const r = await sb.from("messages").delete().eq("id", m.id);
      if (r.error) alert(r.error.message); else load();
    };
    li.append(n, t, p, d); ul.append(li);
  });
}
(async () => {
  if (!sb) { $("#lerr").textContent = "Supabase is not configured. Fill in js/config.js."; return; }
  const { data } = await sb.auth.getSession();
  if (data.session) { show(true); load(); }
  $("#login").addEventListener("submit", async e => {
    e.preventDefault(); $("#lerr").textContent = "";
    const { error } = await sb.auth.signInWithPassword({ email: $("#em").value.trim(), password: $("#pw").value });
    if (error) { $("#lerr").textContent = "Sign-in failed: " + error.message; return; }
    $("#pw").value = ""; show(true); load();
  });
  $("#refresh").onclick = load;
  $("#logout").onclick = async () => { await sb.auth.signOut(); show(false); };
})();
