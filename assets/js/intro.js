/* HOCINE CHAPATI — intro
   1) Le logo s'affiche tout de suite (plus de lampe)
   2) Il remonte et « Bienvenue chez nous » s'écrit dessous
   3) Page de choix (Bol H / pizza du menu qui flottent)
   4) Message selon le choix, puis le site s'ouvre normalement sur la page 1, avec le plat choisi */
(() => {
  const SHOW = 1100;       // le logo seul, avant les écritures
  const root = document.documentElement;
  const el = document.getElementById("intro");
  const choice = document.getElementById("choice");
  if (!el) return;
  if (!root.classList.contains("has-intro")) { el.remove(); choice?.remove(); return; }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let done = false, skipped = false;

  /* ---------- « Bienvenue chez nous » ---------- */
  const type = async (node, text, speed) => {
    node.classList.add("is-typing");
    for (const ch of text) { node.textContent += ch; await wait(speed); }
    node.classList.remove("is-typing");
  };

  /* ---------- fin : ouvre le site en haut de la page 1 ---------- */
  const finish = (pick) => {
    if (done) return;
    done = true;
    el.classList.add("is-leaving");
    choice.classList.add("is-leaving");
    root.classList.remove("has-intro");
    scrollTo({ top: 0, behavior: "instant" });
    dispatchEvent(new CustomEvent("intro:done", { detail: { pick } }));
    setTimeout(() => { el.remove(); choice.remove(); }, 1200);
  };

  /* ---------- page de choix ---------- */
  const MSG = {
    bol: "Excellent choix ! Votre Bol H Chapati vous attend, chaud et généreux.",
    pizza: "Bon choix ! Une pizza gourmande vous attend."
  };
  const msg = document.getElementById("choiceMsg");
  choice.querySelectorAll("[data-pick]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (choice.classList.contains("is-picked")) return;
      btn.classList.add("is-chosen");
      choice.classList.add("is-picked");
      await type(msg, MSG[btn.dataset.pick], 28);
      await wait(1300);
      finish(btn.dataset.pick);
    });
  });
  document.getElementById("choiceAll").addEventListener("click", () => finish(null));

  /* ---------- déroulé ---------- */
  const run = async () => {
    await wait(SHOW);
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
})();
