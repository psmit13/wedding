(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- language toggle (English / Gujarati) ---------- */
  const GU = {
    "Shree Swaminarayano Vijayate": "શ્રી સ્વામિનારાયણો વિજયતે",
    "Manglik Prasang": "માંગલિક પ્રસંગ",
    "days": "દિવસ", "hours": "કલાક", "minutes": "મિનિટ", "seconds": "સેકન્ડ",
    "Jitendrakumar &amp;": "જીતેન્દ્રકુમાર અને",
    "Indiraben Patel": "ઇન્દિરાબેન પટેલ",
    "request the honour of your presence at the Manglik Prasang of our beloved son": "અમારા વહાલા દીકરાના માંગલિક પ્રસંગે પધારવા આપને ભાવભર્યું આમંત્રણ",
    "Smit": "સ્મિત", "Harsiddh": "હરસિધ્ધ",
    "January 21st, 2027": "૨૧ જાન્યુઆરી, ૨૦૨૭",
    "Ganesh Sthapan | Mandva Muhrat": "ગણેશ સ્થાપન | મંડપ મુહૂર્ત",
    "Ganesh Sthapan · Mandva Muhrat": "ગણેશ સ્થાપન · મંડપ મુહૂર્ત",
    "Pithi Ceremony": "પીઠી",
    "8:00 AM": "સવારે ૮:૦૦", "9:00 AM": "સવારે ૯:૦૦", "10:30 AM": "સવારે ૧૦:૩૦", "12:30 PM": "બપોરે ૧૨:૩૦",
    "BAPS Shri Swaminarayan Mandir<br>Sarangpur": "બી.એ.પી.એસ. શ્રી સ્વામિનારાયણ મંદિર<br>સારંગપુર",
    "Lagna": "લગ્ન",
    "with the grace and blessings of": "શુભ આશીર્વાદ",
    "Bhagwan Swaminarayan": "ભગવાન સ્વામિનારાયણ",
    "Guruhari Pramukh Swami Maharaj": "ગુરુહરિ પ્રમુખસ્વામી મહારાજ",
    "Pragat Guruhari Mahant Swami Maharaj": "પ્રગટ ગુરુહરિ મહંતસ્વામી મહારાજ",
    "<b>Grandson of</b>Late Ratilalbhai Patel &amp; Late Taraben Patel": "<b>પૌત્ર</b>સ્વ. રતિલાલભાઈ પટેલ અને સ્વ. તારાબેન પટેલ",
    "<b>Daughter of</b>Kalpeshbhai &amp; Manishben Prajapati": "<b>પુત્રી</b>કલ્પેશભાઈ અને મનીષબેન પ્રજાપતિ",
    "weds": "&amp;",
    "Join us": "પધારશો",
    "Jaan Prasthan": "જાન પ્રસ્થાન",
    "Hasta Melāp": "હસ્તમેળાપ",
    "Scroll": "સ્ક્રોલ કરો",
    "The venue": "સ્થળ",
    "Sarangpur": "સારંગપુર",
    "BAPS Shri Swaminarayan Mandir<br>Sarangpur, Gujarat, India": "બી.એ.પી.એસ. શ્રી સ્વામિનારાયણ મંદિર<br>સારંગપુર, ગુજરાત, ભારત",
    "Open in Maps": "નકશામાં જુઓ",
    "RSVP": "આપની હાજરી",
    "Kindly let us know if you will be joining us.": "આપ પધારશો કે નહીં, તે જરૂર જણાવશો.",
    "Name": "નામ",
    "Attendance": "હાજરી",
    "Joyfully attending": "જરૂર આવીશું",
    "Unable to attend": "નહીં આવી શકીએ",
    "Phone number": "ફોન નંબર",
    "Attending from": "ક્યાંથી આવો છો",
    "India": "ભારત", "Canada": "કેનેડા",
    "How many people": "કેટલા લોકો",
    "Transportation": "કેવી રીતે આવશો",
    "(Bus arranged for all guests)": "(બધા મહેમાનો માટે બસની વ્યવસ્થા છે)",
    "Own vehicle": "પોતાનું વાહન",
    "Bus transport": "બસમાં",
    "Which bus?": "કઈ બસ?",
    "Bus from Vadodara<small>Atladara BAPS Mandir · 6:00 AM</small>": "વડોદરાથી બસ<small>અટલાદરા BAPS મંદિર · સવારે ૬:૦૦</small>",
    "Bus from Ahmedabad<small>Vaishnodevi Circle · 8:00 AM</small>": "અમદાવાદથી બસ<small>વૈષ્ણોદેવી સર્કલ · સવારે ૮:૦૦</small>",
    "Send RSVP": "મોકલો",
    "Thank you": "આભાર",
    "Smit <em>&amp;</em> Harsiddh": "સ્મિત <em>&amp;</em> હરસિધ્ધ",
    "21 January 2027 · Sarangpur": "૨૧ જાન્યુઆરી ૨૦૨૭ · સારંગપુર",
    /* messages shown by the RSVP form */
    "Please enter your name.": "કૃપા કરી આપનું નામ લખો.",
    "Please let us know if you can attend.": "કૃપા કરી જણાવો કે આપ આવી શકશો કે નહીં.",
    "Please enter a valid phone number.": "કૃપા કરી સાચો ફોન નંબર લખો.",
    "Please choose India or Canada.": "કૃપા કરી ભારત કે કેનેડા પસંદ કરો.",
    "Enter a number between 1 and 30.": "૧ થી ૩૦ વચ્ચેની સંખ્યા લખો.",
    "Please choose how you will travel.": "કૃપા કરી કેવી રીતે આવશો તે પસંદ કરો.",
    "Please choose a bus.": "કૃપા કરી બસ પસંદ કરો.",
    "Sending…": "મોકલાય છે…",
    "RSVP is not open yet, so this response was not saved. Please check back soon.": "હજી જવાબ મોકલી શકાતો નથી. થોડી વાર પછી ફરી પ્રયત્ન કરો.",
    "Sorry, your RSVP could not be sent. Please check your connection and try again.": "માફ કરશો, જવાબ મોકલી શકાયો નહીં. ઇન્ટરનેટ તપાસીને ફરી પ્રયત્ન કરો.",
    "We can't wait to celebrate with you, {n}. See you in Sarangpur!": "{n}, આપની રાહ જોઈશું. સારંગપુરમાં મળીએ!",
    "Thank you for letting us know, {n}. You will be missed.": "{n}, જણાવવા બદલ આભાર. આપની ખોટ સાલશે."
  };
  let lang = "en";
  try { lang = new URLSearchParams(location.search).get("lang") || localStorage.getItem("lang") || "en"; } catch (e) {}
  if (lang !== "gu") lang = "en";
  const t = s => (lang === "gu" && GU[s]) || s;
  const guDigits = s => lang === "gu" ? String(s).replace(/\d/g, d => "૦૧૨૩૪૫૬૭૮૯"[d]) : String(s);
  const textEls = $$("main *").filter(el => GU[el.innerHTML.trim()]);
  textEls.forEach(el => el.dataset.en = el.innerHTML.trim());
  const titleEn = document.title;
  const toggle = document.createElement("button");
  toggle.type = "button"; toggle.className = "lang-toggle";
  document.body.appendChild(toggle);
  function applyLang() {
    document.documentElement.lang = lang;
    textEls.forEach(el => { el.innerHTML = lang === "gu" ? GU[el.dataset.en] : el.dataset.en; });
    document.title = lang === "gu" ? "સ્મિત & હરસિધ્ધ · લગ્ન આમંત્રણ" : titleEn;
    toggle.textContent = lang === "gu" ? "English" : "ગુજરાતી";
    toggle.setAttribute("aria-label", lang === "gu" ? "Switch to English" : "ગુજરાતીમાં જુઓ");
    $$(".err").forEach(e => { if (e.dataset.en) e.textContent = t(e.dataset.en); });
  }
  toggle.addEventListener("click", () => {
    lang = lang === "gu" ? "en" : "gu";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    applyLang();
    dispatchEvent(new Event("resize"));
  });
  applyLang();


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


  /* ---------- venue arch gallery ---------- */
  (function () {
    const g = document.querySelector(".venue-gallery"); if (!g) return;
    const track = g.querySelector(".vg-track"), slides = [...g.querySelectorAll(".vg-slide")];
    const prev = g.querySelector(".vg-prev"), next = g.querySelector(".vg-next"), dotsEl = g.querySelector(".vg-dots");
    const dots = slides.map((_, i) => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Photo " + (i + 1) + " of " + slides.length);
      b.addEventListener("click", () => go(i)); dotsEl.appendChild(b); return b;
    });
    const idx = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = i => track.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, i)) * track.clientWidth });
    const sync = () => {
      const i = idx();
      dots.forEach((d, j) => d.setAttribute("aria-selected", j === i));
      prev.disabled = i === 0; next.disabled = i === slides.length - 1;
    };
    prev.addEventListener("click", () => go(idx() - 1));
    next.addEventListener("click", () => go(idx() + 1));
    track.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(idx() - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(idx() + 1); }
    });
    let raf; track.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener("resize", sync);
    // mouse drag on desktop
    let down = false, sx = 0, sl = 0;
    track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = track.scrollLeft; track.style.scrollSnapType = "none"; track.style.scrollBehavior = "auto"; });
    window.addEventListener("pointermove", e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener("pointerup", e => {
      if (!down) return; down = false; track.style.scrollSnapType = ""; track.style.scrollBehavior = "";
      const d = e.clientX - sx, i = Math.round(sl / track.clientWidth);
      go(Math.abs(d) > 40 ? i + (d < 0 ? 1 : -1) : i);
    });
    sync();
  })();

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
    for (const k in v) $$(`[data-u="${k}"]`).forEach(el => el.textContent = guDigits(k === "d" ? v[k] : String(v[k]).padStart(2, "0")));
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

  function setErr(name, text) { const e = $(`.err[data-for="${name}"]`, form); if (e) { e.dataset.en = text || ""; e.textContent = t(text || ""); } return !text; }
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
      msg.textContent = t("RSVP is not open yet, so this response was not saved. Please check back soon.");
      return;
    }
    const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = t("Sending…");
    try {
      const res = await fetch(`${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1/${cfg.table || "rsvps"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: cfg.supabaseKey, Authorization: `Bearer ${cfg.supabaseKey}`, Prefer: "return=minimal" },
        body: JSON.stringify(row)
      });
      if (!res.ok) throw new Error(String(res.status));
      form.hidden = true;
      $("#thanks-text").textContent = yes
        ? t("We can't wait to celebrate with you, {n}. See you in Sarangpur!").replace("{n}", row.name.split(" ")[0])
        : t("Thank you for letting us know, {n}. You will be missed.").replace("{n}", row.name.split(" ")[0]);
      $("#thanks").hidden = false;
    } catch (err) {
      msg.className = "form-msg bad";
      msg.textContent = t("Sorry, your RSVP could not be sent. Please check your connection and try again.");
      btn.disabled = false; btn.textContent = t("Send RSVP");
    }
  });
})();
