const sb = window.sb;

const $ = (s) => document.querySelector(s);

const show = (on) => {
  $("#login").hidden = on;
  $("#panel").hidden = !on;
};

async function load() {
  const ul = $("#list");
  ul.textContent = "";
  $("#note").textContent = "Loading messages...";

  const { data, error } = await sb
    .from("messages")
    .select("id,name,message,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    $("#count").textContent = "";
    $("#note").textContent = "Could not load messages: " + error.message;
    return;
  }

  $("#count").textContent = `${data.length} message(s)`;
  $("#note").textContent = data.length
    ? ""
    : "Пока сообщений нет.";

  data.forEach((m) => {
    const li = document.createElement("li");
    const n = document.createElement("b");
    const t = document.createElement("time");
    const p = document.createElement("p");
    const d = document.createElement("button");

    n.textContent = m.name;
    t.textContent = new Date(m.created_at).toLocaleString();
    p.textContent = m.message;
    d.textContent = "Delete";

    d.onclick = async () => {
      if (!confirm("Удалить это сообщение навсегда?")) return;

      const { error } = await sb
        .from("messages")
        .delete()
        .eq("id", m.id);

      if (error) {
        alert("Ошибка удаления: " + error.message);
      } else {
        load();
      }
    };

    li.append(n, t, p, d);
    ul.append(li);
  });
}

(async () => {
  if (!sb) {
    $("#lerr").textContent =
      "Supabase не настроен. Проверь js/config.js.";
    return;
  }

  const { data, error } = await sb.auth.getSession();

  if (error) {
    $("#lerr").textContent = error.message;
    return;
  }

  if (data.session) {
    show(true);
    await load();
  }

  $("#login").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#lerr").textContent = "";

    console.log("Email для входа:", $("#em").value.trim());
    console.log("Password для входа:", $("#pw").value);

    const { error } = await sb.auth.signInWithPassword({
      email: $("#em").value.trim(),
      password: $("#pw").value
    });

    if (error) {
      $("#lerr").textContent = "Ошибка входа: " + error.message;
      return;
    }

    $("#pw").value = "";
    show(true);
    await load();
  });

  $("#refresh").onclick = load;

  $("#logout").onclick = async () => {
    await sb.auth.signOut();
    show(false);
  };
})();
