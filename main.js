(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- scroll-driven scenes: each pinned scene gets --p from 0 to 1 ----------
     Geometry is cached (no layout reads while scrolling) and --p glides toward the
     scroll position with a short, frame-rate independent ease, so motion stays silky
     without feeling delayed. */
  const scenes = $$("[data-scene]").map(el => ({ el, top: 0, len: 1, cur: 0, tgt: 0 }));
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let vh = innerHeight, maxScroll = 1, running = false, last = 0;
  function measure() {
    vh = innerHeight;
    const y = scrollY;
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + y; s.len = Math.max(1, r.height - vh);
    }
    maxScroll = Math.max(1, root.scrollHeight - vh);
    targets(); for (const s of scenes) { s.cur = s.tgt; paint(s); }
  }
  function targets() {
    const y = scrollY;
    for (const s of scenes) s.tgt = Math.min(1, Math.max(0, (y - s.top) / s.len));
    root.style.setProperty("--scroll", (y / maxScroll).toFixed(4));
  }
  function paint(s) { s.el.style.setProperty("--p", s.cur.toFixed(4)); }
  function frame(now) {
    const dt = Math.min(64, now - (last || now)); last = now;
    const k = still ? 1 : 1 - Math.exp(-dt / 70);
    let moving = false;
    for (const s of scenes) {
      const d = s.tgt - s.cur;
      if (Math.abs(d) < 0.0004) { if (s.cur !== s.tgt) { s.cur = s.tgt; paint(s); } continue; }
      s.cur += d * k; paint(s); moving = true;
    }
    if (moving) requestAnimationFrame(frame); else { running = false; last = 0; }
  }
  function kick() { targets(); if (!running) { running = true; requestAnimationFrame(frame); } }
  addEventListener("scroll", kick, { passive: true });
  addEventListener("resize", () => { measure(); kick(); });
  addEventListener("load", measure);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();

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
