/* HOCINE CHAPATI — entrée de la page Menu
   « Une faim de chapati ? » s'affiche, puis s'ouvre vers le haut et dévoile la carte
   (automatiquement après GATE ms, ou tout de suite avec « Voir le menu »). */
(() => {
  const GATE = 3000;
  const root = document.documentElement;
  const gate = document.getElementById("gate");
  if (!gate) return;

  let open = false;
  const enter = () => {
    if (open) return;
    open = true;
    clearTimeout(timer);
    gate.classList.add("is-out");
    root.classList.remove("has-gate");
    dispatchEvent(new Event("gate:done"));
    setTimeout(() => gate.remove(), 1000);
  };

  const timer = setTimeout(enter, GATE);
  document.getElementById("gateEnter").addEventListener("click", enter);
  addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === "Escape") enter(); });
  requestAnimationFrame(() => requestAnimationFrame(() => gate.classList.add("is-on")));
})();
