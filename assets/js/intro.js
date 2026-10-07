/* HOCINE CHAPATI — intro
   1) Logo dans le noir : la souris / le doigt l'éclaire comme une lampe (TORCH ms)
   2) La lumière s'ouvre et « Bienvenue chez nous » s'écrit sous le logo
   3) Page de choix (chapati / pizza qui flottent)
   4) Message selon le choix, puis le site s'ouvre sur la bonne section */
(() => {
  const TORCH = 5000;      // durée du mode lampe
  const OPEN = 900;        // ouverture de la lumière
  const root = document.documentElement;
  const el = document.getElementById("intro");
  const choice = document.getElementById("choice");
  if (!el) return;
  if (!root.classList.contains("has-intro")) { el.remove(); choice?.remove(); return; }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const isTouch = matchMedia("(pointer: coarse)").matches;
  const baseR = () => Math.max(80, Math.min(innerWidth, innerHeight) * (isTouch ? 0.2 : 0.15));

  /* ---------- 1) lampe torche ---------- */
  let tx = innerWidth / 2, ty = innerHeight / 2;
  let x = tx, y = ty, r = baseR();
  let manual = false, opening = false, stopped = false, done = false, raf;
  const t0 = performance.now();

  const frame = (now) => {
    const t = (now - t0) / 1000;
    if (!manual && !opening) {
      // balayage automatique autour du logo tant que personne ne bouge
      tx = innerWidth / 2 + Math.min(innerWidth, innerHeight) * 0.22 * Math.sin(t * 0.9);
      ty = innerHeight / 2 + Math.min(innerWidth, innerHeight) * 0.2 * Math.sin(t * 1.7 + 1);
    }
    x += (tx - x) * 0.14;
    y += (ty - y) * 0.14;
    el.style.setProperty("--x", `${x.toFixed(1)}px`);
    el.style.setProperty("--y", `${y.toFixed(1)}px`);
    el.style.setProperty("--r", `${r.toFixed(1)}px`);
    if (!stopped) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  const move = (cx, cy) => {
    if (opening) return;
    manual = true;
    el.classList.add("is-touched");
    tx = cx; ty = cy;
  };
  el.addEventListener("pointermove", (e) => move(e.clientX, e.clientY));
  el.addEventListener("touchmove", (e) => { const p = e.touches[0]; move(p.clientX, p.clientY); }, { passive: true });
  el.addEventListener("touchstart", (e) => { const p = e.touches[0]; move(p.clientX, p.clientY); }, { passive: true });
  addEventListener("resize", () => { if (!opening) r = baseR(); });

  // la lumière grandit jusqu'à tout éclairer
  const open = (ms) => new Promise((resolve) => {
    opening = true;
    const from = r, to = Math.hypot(innerWidth, innerHeight) * 1.6, s = performance.now();
    const grow = (now) => {
      const k = Math.min(1, (now - s) / ms);
      r = from + (to - from) * (1 - Math.pow(1 - k, 3));
      if (k < 1) requestAnimationFrame(grow); else { stopped = true; resolve(); }
    };
    requestAnimationFrame(grow);
  });

  /* ---------- 2) « Bienvenue chez nous » ---------- */
  const type = async (node, text, speed) => {
    node.classList.add("is-typing");
    for (const ch of text) { node.textContent += ch; await wait(speed); }
    node.classList.remove("is-typing");
  };

  /* ---------- fin : ouvre le site ---------- */
  const finish = (target) => {
    if (done) return;
    done = true;
    stopped = true;
    cancelAnimationFrame(raf);
    el.classList.add("is-leaving");
    choice.classList.add("is-leaving");
    root.classList.remove("has-intro");
    dispatchEvent(new Event("intro:done"));
    if (target) {
      const sec = document.querySelector(target);
      if (sec) requestAnimationFrame(() => sec.scrollIntoView({ behavior: "instant", block: "start" }));
    }
    setTimeout(() => { el.remove(); choice.remove(); }, 1200);
  };

  /* ---------- 3) + 4) page de choix ---------- */
  const MSG = {
    chapati: { text: "Excellent choix ! Votre chapati vous attend, chaud et généreux.", target: "#chapati" },
    pizza: { text: "Bon choix ! Une pizza gourmande vous attend.", target: "#pizzas" }
  };
  const msg = document.getElementById("choiceMsg");
  choice.querySelectorAll("[data-pick]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (choice.classList.contains("is-picked")) return;
      const pick = MSG[btn.dataset.pick];
      btn.classList.add("is-chosen");
      choice.classList.add("is-picked");
      await type(msg, pick.text, 28);
      await wait(1300);
      finish(pick.target);
    });
  });
  document.getElementById("choiceAll").addEventListener("click", () => finish(null));

  /* ---------- déroulé ---------- */
  let skipped = false;
  const run = async () => {
    await wait(TORCH - OPEN);
    if (skipped) return;
    await open(OPEN);
    if (skipped) return;
    el.classList.add("is-welcome");
    await wait(500);
    await type(document.getElementById("w1"), "Bienvenue chez nous", 70);
    await type(document.getElementById("w2"), "Hocine Chapati · Le goût qui rassemble", 26);
    await wait(1400);
    if (skipped) return;
    // le noir s'efface et dévoile la page de choix
    choice.setAttribute("aria-hidden", "false");
    el.classList.add("is-leaving");
    await wait(350);
    choice.classList.add("is-open");           // les plats arrivent des bords, flous puis nets
    await wait(600);
    if (!choice.classList.contains("is-picked")) await type(document.getElementById("cw"), "Bienvenue chez nous", 65);
  };
  run();

  // « Entrer » : on passe tout et on va directement au site
  document.getElementById("introSkip").addEventListener("click", () => { skipped = true; finish(null); });
  addEventListener("keydown", (e) => { if (!done && e.key === "Escape") { skipped = true; finish(null); } });

  // démarre la barre de progression
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-on")));
})();
