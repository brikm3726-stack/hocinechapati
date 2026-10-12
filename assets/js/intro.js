/* HOCINE CHAPATI — intro
   1) Le logo s'affiche tout de suite
   2) Il remonte et « Bienvenue chez nous » s'écrit dessous
   3) Le site s'ouvre normalement sur la page 1 */
(() => {
  const SHOW = 1100;       // le logo seul, avant les écritures
  const root = document.documentElement;
  const el = document.getElementById("intro");
  if (!el) return;
  if (!root.classList.contains("has-intro")) { el.remove(); return; }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let done = false, skipped = false;

  /* ---------- « Bienvenue chez nous » ---------- */
  const type = async (node, text, speed) => {
    node.classList.add("is-typing");
    for (const ch of text) { node.textContent += ch; await wait(speed); }
    node.classList.remove("is-typing");
  };

  /* ---------- fin : ouvre le site en haut de la page 1 ---------- */
  const finish = () => {
    if (done) return;
    done = true;
    el.classList.add("is-leaving");
    root.classList.remove("has-intro");
    scrollTo({ top: 0, behavior: "instant" });
    dispatchEvent(new CustomEvent("intro:done"));
    setTimeout(() => el.remove(), 1200);
  };

  /* ---------- déroulé ---------- */
  const run = async () => {
    await wait(SHOW);
    if (skipped) return;
    el.classList.add("is-welcome");
    await wait(500);
    await type(document.getElementById("w1"), "Bienvenue chez nous", 70);
    await type(document.getElementById("w2"), "Hocine Chapati · Le goût qui rassemble", 26);
    await wait(1400);
    if (!skipped) finish();
  };
  run();

  // « Entrer » : on passe tout et on va directement au site
  document.getElementById("introSkip").addEventListener("click", () => { skipped = true; finish(); });
  addEventListener("keydown", (e) => { if (!done && e.key === "Escape") { skipped = true; finish(); } });
})();
