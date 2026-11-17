(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- scroll-driven scenes: each pinned scene gets --p from 0 to 1 ---------- */
  const scenes = $$("[data-scene]");
  const root = document.documentElement;
  let ticking = false;
  function update() {
    ticking = false;
    const vh = window.innerHeight;
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const total = Math.max(1, r.height - vh);
      const p = Math.min(1, Math.max(0, -r.top / total));
      s.style.setProperty("--p", p.toFixed(4));
    }
    const max = document.documentElement.scrollHeight - vh;
    root.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  scenes.forEach(s => s.style.setProperty("--p", 0));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();

  /* ---------- reveal on enter ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; io.observe(el); });
  } else $$(".reveal").forEach(el => el.classList.add("in"));

  /* ---------- countdown to 21 Jan 2027, 8:00 AM India time ---------- */
  const target = Date.parse("2027-01-21T08:00:00+05:30");
  const cd = $("#countdown");
  function tick() {
    let d = Math.max(0, target - Date.now());
    const v = { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60 };
    for (const k in v) $$(`[data-u="${k}"]`).forEach(el => el.textContent = k === "d" ? v[k] : String(v[k]).padStart(2, "0"));
  }
  tick(); setInterval(tick, 1000);

  /* ---------- RSVP ---------- */
  const form = $("#rsvp-form"), msg = $("#form-msg");
  const boxAttend = $("#if-attending"), boxBus = $("#if-bus");
  const val = n => { const el = form.elements[n]; return el ? (el.value ?? "").toString().trim() : ""; };

  function sync() {
    const yes = val("attending") === "yes";
    boxAttend.hidden = !yes;
    boxBus.hidden = !(yes && val("transportation") === "bus");
  }
  form.addEventListener("change", sync);
  form.addEventListener("input", e => { if (e.target.name) setErr(e.target.name, ""); });
  $$(".stepper button", form).forEach(b => b.addEventListener("click", () => {
    const i = form.elements.guest_count;
    i.value = Math.min(30, Math.max(1, (parseInt(i.value, 10) || 1) + Number(b.dataset.step)));
  }));

  function setErr(name, text) { const e = $(`.err[data-for="${name}"]`, form); if (e) e.textContent = text || ""; return !text; }
  function validate() {
    let ok = true; const need = (n, t, cond = true) => { if (!setErr(n, cond && !val(n) ? t : "")) ok = false; };
    need("name", "Please enter your name.");
    need("attending", "Please let us know if you can attend.");
    const attendingYes = val("attending") === "yes";
    const digits = val("phone").replace(/\D/g, "");
    if (!setErr("phone", attendingYes && (digits.length < 7 || digits.length > 15) ? "Please enter a valid phone number." : "")) ok = false;
    need("attending_from", "Please choose India or Canada.", attendingYes);
    const yes = val("attending") === "yes";
    const n = parseInt(val("guest_count"), 10);
    if (!setErr("guest_count", yes && !(n >= 1 && n <= 30) ? "Enter a number between 1 and 30." : "")) ok = false;
    need("transportation", "Please choose how you will travel.", yes);
    need("bus_route", "Please choose a bus.", yes && val("transportation") === "bus");
    return ok;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    msg.className = "form-msg"; msg.textContent = "";
    if (!validate()) { const first = $(".err:not(:empty)", form); first && first.closest(".field").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const yes = val("attending") === "yes", bus = yes && val("transportation") === "bus";
    const row = {
      name: val("name"), phone: yes ? val("phone") : null, attending_from: yes ? val("attending_from") : null, attending: yes,
      guest_count: yes ? parseInt(val("guest_count"), 10) : 0,
      transportation: yes ? val("transportation") : null,
      bus_route: bus ? val("bus_route") : null
    };
    const cfg = window.RSVP_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseKey) {
      msg.className = "form-msg bad";
      msg.textContent = "RSVP is not open yet, so this response was not saved. Please check back soon.";
      return;
    }
    const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
    try {
      const res = await fetch(`${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1/${cfg.table || "rsvps"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: cfg.supabaseKey, Authorization: `Bearer ${cfg.supabaseKey}`, Prefer: "return=minimal" },
        body: JSON.stringify(row)
      });
      if (!res.ok) throw new Error(String(res.status));
      form.hidden = true;
      $("#thanks-text").textContent = yes
        ? `We can't wait to celebrate with you, ${row.name.split(" ")[0]}. See you in Sarangpur!`
        : `Thank you for letting us know, ${row.name.split(" ")[0]}. You will be missed.`;
      $("#thanks").hidden = false;
    } catch (err) {
      msg.className = "form-msg bad";
      msg.textContent = "Sorry, your RSVP could not be sent. Please check your connection and try again.";
      btn.disabled = false; btn.textContent = "Send RSVP";
    }
  });
})();
/* page-to-page transitions: each pinned page holds its place and dissolves into the next */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const scenes = [...document.querySelectorAll("[data-scene]")];
  const ease = v => v * v * (3 - 2 * v);
  let queued = false;
  function run() {
    queued = false;
    scenes.forEach((s, i) => {
      const st = s.firstElementChild, r = s.getBoundingClientRect(), h = st.offsetHeight;
      let y = 0, o = 1, z = 1;
      if (r.top >= h || r.bottom <= 0) o = 0;
      else if (r.top > 0) { y = -r.top; o = i ? ease(1 - r.top / h) : 1; z = 1 + (1 - o) * 0.06; }
      else if (r.bottom < h) { y = h - r.bottom; const n = s.nextElementSibling; o = n && n.hasAttribute("data-scene") ? 1 : ease(r.bottom / h); }
      st.style.transform = "translate3d(0," + y + "px,0) scale(" + z + ")";
      st.style.opacity = o;
      st.style.visibility = o ? "visible" : "hidden";
    });
  }
  const on = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
  addEventListener("scroll", on, { passive: true });
  addEventListener("resize", on);
  run();
})();
