/* Lichter v7 · interactie */
(() => {
  const rust = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const muis = false; /* geen muis-effecten: de site moet gewoon als een normale website werken */
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const opslag = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* titel woord voor woord */
  $$(".split").forEach((h) => { let n = 0; h.innerHTML = h.textContent.split(" ").map((w) => `<span class="w" style="--i:${n++}">${w}</span>`).join(" "); });

  /* in beeld: secties schuiven zacht op */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("zie"); io.unobserve(e.target); } }), { threshold: .15, rootMargin: "0px 0px -40px 0px" });
  $$(".rv,.schema").forEach((el) => io.observe(el));

  /* magnetische knoppen + klik-golf */
  $$(".pill").forEach((b) => {
    if (muis && !rust && b.classList.contains("mag")) {
      b.addEventListener("mousemove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener("mouseleave", () => (b.style.transform = ""));
    }
    b.addEventListener("pointerdown", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--rx", e.clientX - r.left + "px"); b.style.setProperty("--ry", e.clientY - r.top + "px"); b.classList.remove("klik"); void b.offsetWidth; b.classList.add("klik"); setTimeout(() => b.classList.remove("klik"), 600); });
  });

  /* hero: foto en icoontjes volgen de muis */
  const hero = document.querySelector("[data-parallax]");
  if (hero && muis && !rust) {
    const sec = hero.closest("section");
    sec.addEventListener("mousemove", (e) => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $$("[data-depth]", hero).forEach((el) => { const d = +el.dataset.depth; el.style.transform = `translate(${-x * d}px,${-y * d}px) rotate(${x * 8}deg)`; });
      hero.querySelector(".foto").style.transform = `translate(${x * 10}px,${y * 10}px)`; });
    sec.addEventListener("mouseleave", () => { $$("[data-depth]", hero).forEach((el) => (el.style.transform = "")); hero.querySelector(".foto").style.transform = ""; });
  }

  /* routekaarten en grote iconen kantelen mee met de muis */
  if (muis && !rust) {
    $$(".route").forEach((c) => {
      c.addEventListener("mousemove", (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(800px) rotateY(${(x - .5) * 14}deg) rotateX(${(.5 - y) * 14}deg) translateY(-6px)`; c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%"); });
      c.addEventListener("mouseleave", () => (c.style.transform = ""));
    });
    $$(".rhero").forEach((h) => { const img = h.querySelector("img");
      h.addEventListener("mousemove", (e) => { const r = h.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; img.style.transform = `translate(${x * -24}px,${y * -24}px) rotate(${x * 6}deg) scale(1.04)`; });
      h.addEventListener("mouseleave", () => (img.style.transform = "")); });
  }


  /* muis: zachte cursor-cirkel, kaarten kantelen, foto's schuiven mee */
  if (muis && !rust) {
    const ring = document.createElement("div"); ring.className = "cursor"; document.body.appendChild(ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; ring.classList.add("aan"); }, { passive: true });
    document.addEventListener("mouseleave", () => ring.classList.remove("aan"));
    (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = "translate(" + rx + "px," + ry + "px)"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", (e) => { const t = e.target.closest("a,button,.dag,.check,summary,input"); ring.classList.toggle("groot", !!t); });
    $$(".plan,.recept,.tip,.mp,.uit,.regel,.kern div,.post,.andere a,.lijst>div").forEach((c) => {
      c.addEventListener("mousemove", (e) => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = "perspective(900px) rotateY(" + x * 8 + "deg) rotateX(" + -y * 8 + "deg) translateY(-4px)"; c.style.transition = "transform .12s ease-out"; });
      c.addEventListener("mouseleave", () => { c.style.transform = ""; c.style.transition = ""; });
    });
    $$(".moment,.gidsblok,.kort-img,.ft-img,.a-kop,.g-kop,.phero").forEach((s) => { const img = s.querySelector("img");
      if (!img) return;
      s.addEventListener("mousemove", (e) => { const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        img.style.translate = (x * -18) + "px " + (y * -14) + "px"; img.style.scale = "1.06"; });
      s.addEventListener("mouseleave", () => { img.style.translate = ""; img.style.scale = ""; }); });
    $$(".reken,.quizbox").forEach((s) => s.addEventListener("mousemove", (e) => { const r = s.getBoundingClientRect(); s.style.setProperty("--gx", (e.clientX - r.left) + "px"); s.style.setProperty("--gy", (e.clientY - r.top) + "px"); }));
  }

  /* foto van het stel: groeit van kader naar volledig scherm tijdens scrollen */
  const groei = document.querySelector("[data-groei]");
  if (groei && !rust) {
    const spoor = groei.closest(".m2-spoor"); let raf2 = 0;
    const upd2 = () => { raf2 = 0; const r = spoor.getBoundingClientRect(), weg = r.height - innerHeight;
      const g = weg > 0 ? Math.min(1, Math.max(0, -r.top / (weg * .8))) : 1;
      groei.style.setProperty("--g", g.toFixed(3)); };
    addEventListener("scroll", () => { if (!raf2) raf2 = requestAnimationFrame(upd2); }, { passive: true });
    addEventListener("resize", upd2); upd2();
  } else if (groei) groei.style.setProperty("--g", 1);

  /* salade-video: beeldjes volgen het scrollen (vooruit en terug), zinnen wisselen */
  const scrub = document.querySelector("[data-scrub]");
  if (scrub) {
    /* telefoon: lichtere set met de helft van de beeldjes */
    const mob = innerWidth < 900, ds = scrub.dataset;
    const N = mob && ds.nm ? +ds.nm : +ds.n || 96, map = mob && ds.nm ? "img/v7/salade/mob/" : "img/v7/salade/";
    const A = mob && ds.nm ? +ds.am : +ds.a || 0, B = mob && ds.nm ? +ds.bm : +ds.b || 0;
    const pin = scrub.querySelector(".m3-pin");
    const cv = scrub.querySelector("canvas"), ctx = cv.getContext("2d"), regels = scrub.querySelectorAll(".m3-r");
    const beelden = [], klaarB = []; let laatste = -1, getekend = -1, raf3 = 0;
    const naam = (i) => map + "f" + String(i + 1).padStart(3, "0") + ".webp";
    /* alleen beeldjes tekenen die helemaal klaar (gedecodeerd) zijn; anders het dichtstbijzijnde klare beeldje */
    const teken = (i) => { let j = -1; for (let k = 0; k < N; k++) { if (klaarB[i - k]) { j = i - k; break; } if (klaarB[i + k]) { j = i + k; break; } }
      if (j < 0 || j === getekend) return; const im = beelden[j];
      if (cv.width !== im.naturalWidth) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; }
      ctx.drawImage(im, 0, 0); getekend = j; scrub.classList.add("klaar"); };
    /* telefoon: blok precies zo hoog als tekst + video (geen leeg beige vlak), en de video begint al tijdens het inschuiven */
    const stTop = () => parseFloat(getComputedStyle(pin).top) || 0;
    /* alleen opnieuw rekenen als de breedte verandert: de adresbalk van de telefoon die in- en uitschuift telt niet */
    let laatsteB = 0; const hoogte0 = innerHeight;
    const pas = () => { if (innerWidth === laatsteB) return; laatsteB = innerWidth;
      if (mob) scrub.style.height = (pin.offsetHeight + Math.round(hoogte0 * .9)) + "px"; else scrub.style.height = ""; };
    pas(); addEventListener("resize", pas);
    const voortgang = () => { const r = scrub.getBoundingClientRect(), st = stTop(), weg = r.height - pin.offsetHeight, start = mob ? st + innerHeight * .12 : st;
      const lengte = weg + start - st; return lengte > 0 ? Math.min(1, Math.max(0, (start - r.top) / lengte)) : 0; };
    /* zacht meeglijden: het beeld loopt rustig achter het scrollen aan in plaats van te verspringen */
    let doel = 0, nu = 0;
    const lus = () => { raf3 = 0; nu += (doel - nu) * (mob ? .3 : .2); if (Math.abs(doel - nu) < .02) nu = doel;
      const i = Math.min(N - 1, Math.max(0, Math.round(nu)));
      if (i !== laatste) { teken(i); laatste = i; }
      if (nu !== doel) raf3 = requestAnimationFrame(lus); };
    /* 1e scroll: salade komt omhoog uit de schaal; 2e scroll: de explosie. Alleen vooruit, nooit terugspoelen. */
    const upd3 = () => { const p = voortgang(), q = Math.min(1, p / .96);
      if (!B) doel = q * (N - 1);
      else if (q < .5) { const h = q / .5, rust1 = mob ? .3 : .15; doel = h < rust1 ? 0 : h < rust1 + .12 ? (h - rust1) / .12 * A : A + (h - rust1 - .12) / (.88 - rust1) * (B - A); }
      else doel = B + (q - .5) / .5 * (N - 1 - B);
      const stap = q < .5 ? 0 : 1; regels.forEach((el, k) => el.classList.toggle("on", k === stap));
      if (!raf3) raf3 = requestAnimationFrame(lus); };
    /* 3e scroll: bij de overgang naar de plannen vliegen losse stukjes in 3D naar je toe en langs je heen */
    const vl = scrub.querySelector(".vlieg");
    if (vl && !rust) {
      const stukjes = [...vl.children];
      /* vast in beeld; stukjes gaan meteen naar de zijkanten (nooit over de tekst) en verlaten het scherm zijwaarts */
      const vlieg = () => { const r = scrub.getBoundingClientRect(), na = Math.max(0, stTop() + pin.offsetHeight - r.bottom);
        const t = Math.min(1, na / (innerHeight * .9));
        if (t <= 0 || t >= 1 || r.top > innerHeight) { vl.style.visibility = "hidden"; return; }
        vl.style.visibility = "visible"; vl.style.opacity = 1;
        const W = innerWidth;
        stukjes.forEach((el) => { const dx = +el.dataset.dx, dy = +el.dataset.dy, ro = +el.dataset.r, d = +el.dataset.d;
          const e = Math.min(1, t * d), zij = 1 - Math.pow(1 - e, 3);
          const basis = el.offsetLeft + el.offsetWidth / 2, doelX = dx < 0 ? -.12 * W : 1.12 * W;
          const x = (doelX - basis) * zij, y = dy * e * innerHeight * .3 - na * .15;
          el.style.opacity = e < .05 ? (e / .05).toFixed(2) : 1;
          el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) scale(" + (.6 + zij * 1.4).toFixed(2) + ") rotate(" + (ro * e).toFixed(1) + "deg)"; }); };
      addEventListener("scroll", vlieg, { passive: true }); addEventListener("resize", vlieg); vlieg();
    }
    if (rust) { regels.forEach((el) => el.classList.add("on")); }
    else {
      const laad = (i) => { const im = new Image(); im.decoding = "async"; im.src = naam(i); const ok = () => { klaarB[i] = true; if (Math.abs(i - Math.round(nu)) < Math.abs(getekend - Math.round(nu)) || getekend < 0) { laatste = -1; if (!raf3) raf3 = requestAnimationFrame(lus); } };
        im.onload = () => { (im.decode ? im.decode() : Promise.resolve()).then(ok, ok); }; beelden[i] = im; };
      const start = () => { for (let i = 0; i < N; i++) laad(i); addEventListener("scroll", upd3, { passive: true }); upd3(); };
      new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { o.disconnect(); start(); } }, { rootMargin: "1600px" }).observe(scrub);
    }
  }

  /* grote foto: zoomt en schuift mee met scrollen */
  const mom = document.querySelector("[data-zoom]");
  if (mom && !rust) {
    const img = mom.querySelector("img"); let raf = 0;
    const upd = () => { raf = 0; const r = mom.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (innerHeight + r.height)));
      img.style.setProperty("--py", (-p * 14) + "%"); img.style.setProperty("--ps", (1.18 - p * .14).toFixed(3)); };
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd();
  }

  /* rekenen: BMI, gezond gewicht en eerste doel (Voedingscentrum) */
  const komma = (n) => String(n).replace(".", ",");
  /* grenzen: volwassenen 18,5 / 25 / 30; vanaf 70 jaar 22 / 28 / 30 (Voedingscentrum) */
  const bereken = (kg, cm, jr = 45) => {
    const m = cm / 100, bmi = Math.round(kg / (m * m) * 10) / 10, oud = jr >= 70;
    const [g1, g2, g3] = oud ? [22, 28, 30] : [18.5, 25, 30];
    const gMin = Math.round(g1 * m * m), gMax = Math.round(g2 * m * m), x = Math.round(kg * .05), y = Math.round(kg * .1);
    let label, advies, afvallen = true, jong = jr < 18;
    if (jong) { label = "niet van toepassing"; afvallen = false; advies = "Ben je jonger dan 18? Dan groei je nog, en klopt deze berekening niet. Wil je iets aan je gewicht doen, praat dan eerst met je huisarts of de jeugdarts."; }
    else if (bmi < g1) { label = "ondergewicht"; afvallen = false; advies = "Afvallen is voor jou niet gezond. Twijfel je over je gewicht of je eetpatroon? Praat erover met je huisarts."; }
    else if (bmi < g2) { label = "gezond gewicht"; afvallen = false; advies = oud ? "Je gewicht is gezond voor jouw leeftijd. Afvallen is niet nodig. Blijf bewegen, dat houdt je spieren sterk." : "Je gewicht is al gezond. Afvallen is niet nodig. Gezond eten en bewegen helpen je om fit te blijven."; }
    else if (bmi < g3) { label = "overgewicht"; if (oud) { afvallen = false; advies = "Vanaf 70 jaar raadt het Voedingscentrum pas aan om af te vallen bij een BMI van 30 of hoger. Afvallen is voor jou dus niet nodig. Blijf goed eten en bewegen: dat houdt je spieren sterk."; } else advies = "Een paar kilo eraf geeft al gezondheidswinst. Begin met het eerste doel en neem er de tijd voor."; }
    else { label = "ernstig overgewicht"; advies = oud ? "Vanaf 70 jaar is afvallen alleen verstandig als het helpt bij gezondheidsproblemen, en altijd met begeleiding van je huisarts of een diëtist." : "Met 5 tot 10 procent eraf win je al veel voor je gezondheid. Bij een BMI boven de 30 is het verstandig om ook met je huisarts te praten."; }
    return { bmi, label, gMin, gMax, x, y, advies, afvallen, jong, oud, g1, g2, g3 };
  };
  const meet = { kg: +(opslag.get("lichter-kg") || 85), cm: +(opslag.get("lichter-cm") || 170), jr: +(opslag.get("lichter-jr") || 45) };
  const GRENS = { kg: [40, 220], cm: [140, 210], jr: [12, 100] };
  const EENH = { kg: "kg", cm: "cm", jr: "jaar" };
  const luisteraars = [];
  const zet = (veld, w) => { meet[veld] = Math.min(GRENS[veld][1], Math.max(GRENS[veld][0], w)); opslag.set("lichter-" + veld, meet[veld]); luisteraars.forEach((f) => f()); };
  /* alle tellers op de pagina delen dezelfde waarden */
  $$(".tel").forEach((t) => {
    const veld = t.dataset.veld, out = t.querySelector("output"), eenh = EENH[veld];
    luisteraars.push(() => { out.innerHTML = meet[veld] + "<small>" + eenh + "</small>"; out.classList.remove("tik"); void out.offsetWidth; out.classList.add("tik"); });
    let herhaal = null;
    $$("button", t).forEach((b) => { const stap = () => zet(veld, meet[veld] + +b.dataset.stap);
      b.addEventListener("click", stap);
      b.addEventListener("pointerdown", () => { herhaal = setTimeout(function r() { stap(); herhaal = setTimeout(r, 70); }, 450); });
      ["pointerup", "pointerleave"].forEach((ev) => b.addEventListener(ev, () => clearTimeout(herhaal))); });
  });
  /* uitkomst tonen in elk blok met data-uit */
  luisteraars.push(() => {
    const u = bereken(meet.kg, meet.cm, meet.jr);
    const zetT = (sel, t) => $$('[data-uit="' + sel + '"]').forEach((el) => (el.textContent = t));
    zetT("bmi", u.jong ? "–" : komma(u.bmi)); zetT("label", u.label); zetT("gezond", u.jong ? "geldt niet onder de 18" : u.gMin + " tot " + u.gMax + " kg");
    zetT("g1", komma(u.g1)); zetT("g2", komma(u.g2)); zetT("g3", komma(u.g3));
    const pos = (b) => Math.min(100, Math.max(0, (b - 15) / 25 * 100));
    $$(".schaal").forEach((s) => (s.style.gridTemplateColumns = pos(u.g1) + "fr " + (pos(u.g2) - pos(u.g1)) + "fr " + (pos(u.g3) - pos(u.g2)) + "fr " + (100 - pos(u.g3)) + "fr"));
    $$(".schaal-t span").forEach((s, i) => (s.style.left = pos([u.g1, u.g2, u.g3][i]) + "%"));
    zetT("doel", u.x + " tot " + u.y + " kg eraf"); zetT("weken", "van " + meet.kg + " naar " + (meet.kg - u.y) + " tot " + (meet.kg - u.x) + " kg, in " + u.x * 2 + " tot " + u.y * 2 + " weken"); zetT("advies", u.advies);
    $$('[data-uit="doelblok"]').forEach((el) => (el.hidden = !u.afvallen));
    $$('[data-uit="pijl"]').forEach((el) => (el.style.left = Math.min(100, Math.max(0, (u.bmi - 15) / 25 * 100)) + "%"));
    $$(".bmi-lbl").forEach((el) => (el.dataset.niveau = u.jong ? "laag" : u.bmi < u.g1 ? "laag" : u.bmi < u.g2 ? "goed" : u.bmi < u.g3 ? "let" : "hoog"));
    $$('[data-uit="pijl"]').forEach((el) => (el.hidden = u.jong));
    zetT("r1", "onder " + komma(u.g1)); zetT("r2", komma(u.g1) + " tot " + komma(u.g2)); zetT("r3", komma(u.g2) + " tot " + komma(u.g3)); zetT("r4", komma(u.g3) + " of hoger");
    const niv = u.jong ? "" : u.bmi < u.g1 ? "laag" : u.bmi < u.g2 ? "goed" : u.bmi < u.g3 ? "let" : "hoog";
    $$(".bmi-tabel li").forEach((li) => li.classList.toggle("jij", li.dataset.niv === niv));
    $$(".bmi").forEach((b) => (b.dataset.niveau = niv));
  });
  luisteraars.forEach((f) => f());

  /* Wat past bij jou: gewicht + drie vragen = route en doel */
  const st = document.querySelector(".start");
  if (st) {
    const TEST = { keto: { n: "de gratis keto-test", l: "https://www.paypro.nl/producten/Mijn_Keto_Menu/103017/222645" }, afvallen: { n: "de gratis quiz", l: "https://www.paypro.nl/producten/WegMetDieKilos_Bronze_Plan/114766/222645" } };
    const R = { keto: ["keto.html", "Keto", "Je houdt van duidelijke regels. Bij keto eet je weinig brood, pasta en rijst en meer groente, vis, ei en noten.", "lila"],
      afvallen: ["gewoon-afvallen.html", "Gewoon afvallen", "Je schrapt niets, maar let op wat en hoeveel je eet. Dat houd je het langst vol.", "mint"],
      recepten: ["recepten.html", "Recepten", "Je kookt graag zelf. Met een weekmenu weet je wat je eet en heb je minder snel trek.", "geel"],
      bewegen: ["bewegen.html", "Bewegen", "Bewegen in je eigen tempo, thuis of buiten. Goed voor je gewicht én om sterk te blijven.", "koraal"] };
    const steps = $$(".qstep", st), dots = $$(".stippen i", st), terug = st.querySelector(".terugk"), a = {};
    let nu = 1;
    const sam = (n, t) => { const li = st.querySelector('.samen li[data-s="' + n + '"]'); if (!li) return; li.querySelector("b").textContent = t; li.classList.remove("ok"); void li.offsetWidth; li.classList.add("ok"); };
    const show = (n) => { nu = n; steps.forEach((s) => s.classList.toggle("on", +s.dataset.q === n)); dots.forEach((d, i) => { d.classList.toggle("on", i < n); }); terug.hidden = n === 1 || n === 5; };
    st.querySelector(".verder").addEventListener("click", () => { sam(1, meet.kg + " kg · " + meet.cm + " cm"); show(2); });
    terug.addEventListener("click", () => show(Math.max(1, nu - 1)));
    steps.forEach((s) => $$(".qopt", s).forEach((b) => b.addEventListener("click", () => {
      $$(".qopt", s).forEach((o) => o.classList.remove("gekozen")); b.classList.add("gekozen");
      const q = +s.dataset.q; a[q] = b.dataset.v; sam(q, b.dataset.t);
      setTimeout(() => { if (q === 4) render(b); show(q + 1); }, rust ? 0 : 260);
    })));
    function render(knop) {
      const el = document.getElementById("qres");
      if (a[4] === "zw") { el.innerHTML = '<div class="res-kop geel"><b>Wacht nog even met afvallen</b></div><p>Tijdens zwangerschap en borstvoeding raden we geen afslankplan aan. Je verloskundige of huisarts helpt je met wat wél goed is.</p><button class="qagain" type="button">Opnieuw beginnen</button>'; }
      else {
        let k = { keto: "keto", norm: "afvallen", cook: "recepten", move: "bewegen" }[a[2]], extra = "";
        if (k === "keto" && a[4] === "med") { k = "afvallen"; extra = "Keto past niet goed bij diabetesmedicijnen, daarom deze route. Bespreek het eerst met je huisarts. "; }
        else if (a[4] === "med") extra = "Bespreek je plan eerst met je huisarts. ";
        if ((a[3] === "50" || a[3] === "70") && k !== "bewegen") extra += "Na je 50e helpt bewegen extra om sterk te blijven. ";
        if ((a[3] === "50" || a[3] === "70") && k === "bewegen") extra += "Na je 50e zijn spieroefeningen extra belangrijk, zoals opstaan uit een stoel of traplopen. ";
        if (a[3] === "70") extra += "Vanaf 70 jaar is een BMI van 22 tot 28 gezond. Het Voedingscentrum raadt pas afvallen aan bij een BMI van 30 of hoger, en dan met begeleiding van je huisarts of een diëtist. ";
        const [f, t, p, c] = R[k], u = bereken(meet.kg, meet.cm, a[3] === "70" ? 75 : a[3] === "50" ? 60 : 35), kg = meet.kg, ic = k;
        if (u.bmi < u.g1) { el.innerHTML = '<div class="res-kop geel"><b>Afvallen is voor jou niet nodig</b></div><p>Met een BMI van ' + komma(u.bmi) + ' heb je ondergewicht. Afvallen is dan niet gezond. Twijfel je over je gewicht of je eetpatroon? Praat erover met je huisarts.</p><button class="qagain" type="button">Opnieuw beginnen</button>'; el.querySelector(".qagain").addEventListener("click", () => show(1)); return; }
        if (!u.afvallen) extra = "Je BMI is " + komma(u.bmi) + ". " + (u.label === "gezond gewicht" ? "Je gewicht is al gezond. " : "") + "Afvallen is voor jou niet nodig, maar deze route helpt je om gezond te eten en fit te blijven. " + extra;
        el.innerHTML = '<div class="res-kop ' + c + '"><img src="img/v7/ic-' + ic + '.jpg" alt=""><div><small>Jouw route</small><b>' + t + '</b></div></div>' +
          (u.afvallen ? '<div class="res-cijfers"><div><small>Haalbaar eerste doel</small><b>' + u.x + '–' + u.y + ' kg</b><span>van ' + kg + ' naar ' + (kg - u.y) + '–' + (kg - u.x) + ' kg</span></div><div><small>Met ½ kilo per week</small><b>' + u.x * 2 + '–' + u.y * 2 + ' weken</b><span>gezond gewicht: ' + u.gMin + '–' + u.gMax + ' kg</span></div></div>' : '') +
          '<p>' + extra + p + '</p><div class="res-knop"><a class="pill" href="' + f + '">Bekijk ' + t + ' <span class="ar">→</span></a>' +
          (TEST[k] ? '<a class="tlink" href="' + TEST[k].l + '" target="_blank" rel="sponsored nofollow noopener">of doe meteen ' + TEST[k].n + ' ↗</a>' : '') + '</div>' +
          (TEST[k] ? '<p class="info"><span aria-hidden="true">i</span>Je kiest bij de aanbieder. Via onze links krijgen wij een kleine vergoeding (#ad), jij betaalt niets extra.</p>' : '') + '<button class="qagain" type="button">Opnieuw beginnen</button>';
        if (window.lichterKonfetti) window.lichterKonfetti(knop);
      }
      el.querySelector(".qagain").addEventListener("click", () => { $$(".samen b", st).forEach((x) => (x.textContent = "nog niet ingevuld")); $$(".samen li", st).forEach((x) => x.classList.remove("ok")); show(1); });
    }
  }

  function konfetti(bron) {
    if (rust || !bron) return; const r = bron.getBoundingClientRect(), kl = ["#8f63e8", "#1fa874", "#f9df81", "#ff9f82", "#141414"];
    for (let i = 0; i < 26; i++) { const c = document.createElement("i"); c.className = "konfetti"; c.style.left = r.left + r.width / 2 + "px"; c.style.top = r.top + r.height / 2 + "px"; c.style.background = kl[i % kl.length];
      c.style.setProperty("--dx", (Math.random() - .5) * 360 + "px"); c.style.setProperty("--dy", (-Math.random() * 260 - 40) + "px"); c.style.setProperty("--rot", Math.random() * 720 + "deg");
      document.body.appendChild(c); setTimeout(() => c.remove(), 1200); }
  }
  window.lichterKonfetti = konfetti;

  /* band met artikelen: loopt vanzelf, pauzeert bij muis, sleepbaar */
  /* diashow met plannen: gewone horizontale lijst die vanzelf één plan doorschuift.
     Klikken op een plan werkt gewoon; pijltjes gaan één plan terug of verder; op de telefoon veeg je. */
  /* homepage (telefoon en computer): gratis-test-plannen lopen continu en rustig door als een lopende band (naadloos rond).
     Werkt met transform (niet met scrollen), want iPhones laten een scrollvlak niet vanuit code bewegen.
     Vinger erop = stil en zelf slepen; loslaten = na 1,5 s loopt hij vanzelf verder. Pijltjes schuiven 1 plan. */
  document.querySelectorAll("#gratis .gratis3").forEach((kp) => {
    if (kp.children.length < 2) return;
    const wrap = document.createElement("div"); wrap.className = "band-wrap kp-wrap"; kp.parentNode.insertBefore(wrap, kp); wrap.appendChild(kp);
    const orig = [...kp.children], spoor = document.createElement("div"); spoor.className = "g3-spoor";
    orig.forEach((c) => spoor.appendChild(c));
    orig.forEach((c) => { const k = c.cloneNode(true); k.classList.add("kopie"); k.setAttribute("aria-hidden", "true"); k.querySelectorAll("a,button").forEach((x) => x.setAttribute("tabindex", "-1")); spoor.appendChild(k); });
    kp.appendChild(spoor); kp.classList.add("loopt");
    const pijl = (kant, label, pad) => { const b = document.createElement("button"); b.type = "button"; b.className = "bpijl " + kant; b.setAttribute("aria-label", label);
      b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${pad}"/></svg>`; wrap.appendChild(b); return b; };
    const terug = pijl("terug", "Vorige plan", "M15 5l-7 7 7 7"), verder = pijl("verder", "Volgende plan", "M9 5l7 7-7 7");
    const helft = () => spoor.querySelector(".kopie").offsetLeft - orig[0].offsetLeft;
    const stapB = () => orig[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(spoor).columnGap) || 14);
    let pos = 0, stilTot = 0, vinger = false, sx = 0, sp = 0, tween = null, vorige = 0;
    const zet = () => { const h = helft(); if (h > 0) { while (pos >= h) pos -= h; while (pos < 0) pos += h; } spoor.style.transform = "translate3d(" + (-pos).toFixed(2) + "px,0,0)"; };
    const schuif = (r) => { stilTot = performance.now() + 2500; tween = { van: pos, naar: pos + r * stapB(), t0: performance.now() }; };
    terug.onclick = () => schuif(-1); verder.onclick = () => schuif(1);
    kp.addEventListener("touchstart", (e) => { vinger = true; tween = null; sx = e.touches[0].clientX; sp = pos; }, { passive: true });
    kp.addEventListener("touchmove", (e) => { if (vinger) { pos = sp - (e.touches[0].clientX - sx); zet(); } }, { passive: true });
    kp.addEventListener("touchend", () => { vinger = false; stilTot = performance.now() + 1500; }, { passive: true });
    kp.addEventListener("mouseenter", () => { vinger = true; }); kp.addEventListener("mouseleave", () => { vinger = false; });
    const lus = (t) => { const dt = vorige ? Math.min(50, t - vorige) : 16; vorige = t;
      if (tween) { const k = Math.min(1, (t - tween.t0) / 450), e = 1 - Math.pow(1 - k, 3); pos = tween.van + (tween.naar - tween.van) * e; if (k >= 1) tween = null; zet(); }
      else if (!vinger && t > stilTot && !document.hidden) { pos += dt * .035; zet(); }
      requestAnimationFrame(lus); };
    zet(); requestAnimationFrame(lus);
  });

  /* diashow met plannen: loopt continu en rustig door (de lijst staat er twee keer in, zodat hij naadloos rondgaat).
     Klikken werkt gewoon. Muis erop = pauze. Op de telefoon: tijdens vegen pauze, daarna loopt hij vanzelf verder. */
  $$(".band").forEach((band) => {
    const wrap = band.closest(".band-wrap");
    const helft = () => { const k = band.querySelector(".plan.kopie"); return k ? k.offsetLeft - band.querySelector(".plan").offsetLeft : 0; };
    const kaart = () => { const k = band.querySelector(".plan,.post"); return k ? k.getBoundingClientRect().width + 18 : 320; };
    const snel = rust ? 0 : 0.45;
    let pos = band.scrollLeft, pauze = false, stilTot = 0, vinger = false;
    const lus = () => {
      const h = helft();
      if (!pauze && !vinger && !document.hidden && performance.now() > stilTot && snel) {
        pos += snel; if (h && pos >= h) pos -= h; band.scrollLeft = pos;
      } else { pos = band.scrollLeft; if (h && pos >= h && !vinger) { pos -= h; band.scrollLeft = pos; } }
      requestAnimationFrame(lus);
    };
    requestAnimationFrame(lus);
    const stap = (r) => { stilTot = performance.now() + 900; const h = helft(); let doel = band.scrollLeft + r * kaart(); if (doel < 0 && h) { band.scrollLeft += h; doel += h; } band.scrollTo({ left: doel, behavior: "smooth" }); };
    if (wrap) {
      wrap.querySelector(".bpijl.terug").addEventListener("click", () => stap(-1));
      wrap.querySelector(".bpijl.verder").addEventListener("click", () => stap(1));
    }
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      band.addEventListener("mouseenter", () => (pauze = true)); band.addEventListener("mouseleave", () => (pauze = false));
    }
    band.addEventListener("touchstart", () => (vinger = true), { passive: true });
    band.addEventListener("touchend", () => { vinger = false; stilTot = performance.now() + 1500; }, { passive: true });
    band.addEventListener("wheel", () => { stilTot = performance.now() + 1500; }, { passive: true });
  });

  /* alle plannen: filteren */
  const chips = $$(".chip-f");
  if (chips.length) {
    const kaarten = $$("#lijst .plan");
    const filter = (f) => {
      chips.forEach((c) => { const on = c.dataset.f === f; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
      kaarten.forEach((k) => { const toon = f === "alle" || k.dataset.route === f || (f === "gratis" && k.dataset.gratis === "1");
        if (toon) { k.hidden = false; requestAnimationFrame(() => k.classList.remove("weg")); } else { k.classList.add("weg"); setTimeout(() => { if (k.classList.contains("weg")) k.hidden = true; }, rust ? 0 : 300); } });
      history.replaceState(null, "", f === "alle" ? location.pathname : "#" + f);
    };
    chips.forEach((c) => c.addEventListener("click", () => filter(c.dataset.f)));
    const h = location.hash.slice(1); if (h && chips.some((c) => c.dataset.f === h)) filter(h);
  }

  /* startgids: dagen en boodschappen afvinken, voortgang bewaren */
  const vinkbaar = $$("[data-vink]");
  if (vinkbaar.length) {
    const st = opslag.get("lichter-gids") || {};
    const ring = document.querySelector(".ring .vg"), tel = document.getElementById("gids-tel");
    const dagen = $$(".dag");
    const upd = () => { const klaar = dagen.filter((d) => d.classList.contains("klaar")).length;
      if (ring) ring.style.strokeDashoffset = 150.8 * (1 - klaar / dagen.length);
      if (tel) tel.textContent = klaar + " van de " + dagen.length + " dagen gedaan"; };
    vinkbaar.forEach((el) => {
      const id = el.dataset.vink;
      if (el.classList.contains("dag")) {
        if (st[id]) el.classList.add("klaar");
        const wissel = () => { el.classList.toggle("klaar"); st[id] = el.classList.contains("klaar"); opslag.set("lichter-gids", st); upd();
          el.setAttribute("aria-pressed", st[id]); if (st[id] && dagen.every((d) => d.classList.contains("klaar"))) konfetti(el); };
        el.addEventListener("click", wissel); el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); wissel(); } });
        el.setAttribute("aria-pressed", !!st[id]);
      } else { const inp = el.querySelector("input"); inp.checked = !!st[id]; inp.addEventListener("change", () => { st[id] = inp.checked; opslag.set("lichter-gids", st); }); }
    });
    upd();
    const reset = document.getElementById("gids-reset");
    if (reset) reset.addEventListener("click", () => { opslag.set("lichter-gids", {}); location.reload(); });
  }

  /* pop-up: na 3 seconden op de site, één keer per bezoeker, niet op de gids zelf en niet bij het contactformulier */
  const p = document.getElementById("contactform") ? null : document.getElementById("lpop");
  if (p && !/startgids/.test(location.pathname)) {
    const forceer = /[?&]popup/.test(location.search);
    if (!opslag.get("lichter-pop") || forceer) {
      const show = () => { if (!p.hidden) return; p.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add("on"))); opslag.set("lichter-pop", 1); };
      const close = () => { p.classList.remove("on"); setTimeout(() => (p.hidden = true), 300); };
      setTimeout(show, forceer ? 300 : 3000);
      p.querySelector(".lpop-x").onclick = close; p.querySelector(".lpop-no").onclick = close;
      p.addEventListener("click", (e) => { if (e.target === p) close(); }); addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }
  }
})();

/* contactformulier: opent het mailprogramma van de bezoeker, verstuurt zelf niets */
(() => {
  const f = document.getElementById("contactform");
  if (!f) return;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const naam = f.naam.value.trim(), ond = f.onderwerp.value, ber = f.bericht.value.trim();
    const fout = f.querySelector(".c-fout");
    if (!ber) { fout.hidden = false; f.bericht.focus(); return; }
    fout.hidden = true;
    const body = ber + (naam ? "\n\nGroet,\n" + naam : "");
    location.href = "mailto:lichter.afvallen@gmail.com?subject=" + encodeURIComponent(ond + " (via Lichter)") + "&body=" + encodeURIComponent(body);
  });
})();

/* mobiel menu */
(() => {
  const k = document.querySelector(".mknop"), m = document.getElementById("mmenu");
  if (!k || !m) return;
  const zet = (open) => { k.setAttribute("aria-expanded", open); m.hidden = !open; document.body.classList.toggle("menu-open", open); k.querySelector("span").textContent = open ? "Sluiten" : "Menu"; };
  k.addEventListener("click", () => zet(m.hidden));
  m.addEventListener("click", (e) => { if (e.target.closest("a")) zet(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !m.hidden) zet(false); });
})();


/* woorden omcirkelen of aanstrepen met een handgetekende lijn */
(() => {
  const CIRKEL = "M8 32 C 6 12, 60 4, 100 6 C 150 8, 196 16, 194 34 C 192 54, 140 62, 96 60 C 48 58, 4 52, 6 34 C 7 22, 30 14, 52 12";
  const STREEP = "M4 14 C 50 6, 110 8, 196 10";
  document.querySelectorAll("em.c, em.s").forEach((em) => {
    const c = em.classList.contains("c");
    em.insertAdjacentHTML("beforeend", `<svg class="pen" viewBox="0 0 200 ${c ? 66 : 20}" preserveAspectRatio="none" aria-hidden="true"><path d="${c ? CIRKEL : STREEP}" pathLength="1"/></svg>`);
  });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("getekend"); io.unobserve(e.target); } }), { threshold: 1, rootMargin: "0px 0px -32% 0px" });
  document.querySelectorAll("em.c, em.s").forEach((em) => io.observe(em));
})();
