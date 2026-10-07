/* HOCINE CHAPATI — commande en ligne dans l'iPhone (accueil, section Chapati)
   Le client parcourt toute la carte, choisit taille / suppléments / quantité, remplit son panier,
   puis la commande part sur WhatsApp au restaurant (ou il appelle).
   Les prix viennent de menu-data.js ; le panier est gardé dans le navigateur du client. */
(() => {
  const app = document.getElementById("papp");
  if (!app || !window.HC) return;
  const D = window.HC;
  const WA = D.phoneIntl.replace(/\D/g, "");
  const $ = (s, c = app) => c.querySelector(s);
  const $$ = (s, c = app) => [...c.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const da = (n) => `${n.toLocaleString("fr-FR").replace(/ /g, " ")} DA`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smooth = reduce ? "auto" : "smooth";

  const ICON = {
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    cup: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8h11l-1.4 12H7.9L6.5 8Z"/><path d="M5 8h14M12 8V3.5l3-1"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true" class="is-fill"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/></svg>'
  };

  /* ---------- catalogue (tiré de menu-data.js) ---------- */
  const CH = [["pnj-chapati", 1], ["chapati-close"], ["chapati-mid"], ["chapati-right"], ["chapati-hero"]];
  const PZ = [["pnj-pizza", 1], ["pizza-1"], ["pizza-2"], ["pizza-3"], ["pizza-4"], ["pizza-5"]];
  const bowlImg = (b) => [b.base === "Poutine" ? "bol-poutine" : b.prot === "Viande" ? "bol-pasta-viande" : "bol-pasta"];
  const sized = (labels, prices) => labels.map((label, i) => ({ label, price: prices[i] }));
  const CATS = [
    { id: "s2", label: "Chapati S-2", sub: "Saison 2", items: D.chapatiS2.map((c, i) => ({ name: c.name, desc: c.desc, price: c.price, supps: D.supplementsS2, img: CH[i % CH.length] })) },
    { id: "orig", label: "Chapati Original", items: D.chapatiOriginal.map((c, i) => ({ name: c.name, desc: c.desc, price: c.price, supps: D.supplementsOriginal, img: CH[(i + 1) % CH.length] })) },
    { id: "pizza", label: "Pizzas", sub: "Mini · Normal · Mega", items: D.pizzas.map((p, i) => ({ name: p.name, desc: p.desc, sizes: sized(D.pizzaSizes, p.prices), supps: D.supplementsPizza, img: PZ[i % PZ.length] })) },
    { id: "bol", label: "Bol H Chapati", sub: "M · L · XL", items: D.bowls.map((b) => ({ name: b.name, desc: `Base ${b.base.toLowerCase()}, garniture ${b.prot.toLowerCase()}.`, sizes: sized(D.bowlSizes, b.prices), img: bowlImg(b) })) },
    { id: "form", label: "Formules", items: D.formules.map((f) => ({ name: f.name, price: f.price, img: ["logo", 1] })) },
    { id: "drink", label: "Boissons", items: D.boissons.flatMap((g) => g.items.map(([name, price]) => ({ name, price, desc: g.group }))) }
  ];
  const ITEMS = {};
  CATS.forEach((c) => c.items.forEach((it, i) => { it.id = `${c.id}-${i}`; ITEMS[it.id] = it; }));
  const fromPrice = (it) => (it.sizes ? `dès ${da(Math.min(...it.sizes.map((s) => s.price)))}` : da(it.price));
  const pic = (it, cls) => it.img
    ? `<img class="${cls}${it.img[1] ? ` ${cls}--cut` : ""}" src="assets/img/${it.img[0]}.webp" alt="" width="96" height="96" loading="lazy" decoding="async">`
    : `<span class="${cls} ${cls}--icon">${ICON.cup}</span>`;

  /* ---------- panier (gardé dans ce navigateur) ---------- */
  const STORE = "hc-panier-v1";
  let cart = [];
  try { const v = JSON.parse(localStorage.getItem(STORE)); if (Array.isArray(v)) cart = v; } catch { /* stockage indisponible */ }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(cart)); } catch { /* ignoré */ } };
  // le prix est toujours recalculé depuis la carte (jamais depuis le stockage)
  const info = (l) => {
    const it = ITEMS[l.id];
    if (!it) return null;
    const base = it.sizes ? it.sizes.find((s) => s.label === l.size)?.price : it.price;
    if (base == null) return null;
    const supps = (it.supps || []).filter((s) => l.supps.includes(s.name));
    const unit = base + supps.reduce((t, s) => t + s.price, 0);
    return { it, supps, unit, total: unit * l.qty };
  };
  cart = cart.filter((l) => l && l.qty > 0 && Array.isArray(l.supps) && info(l));
  const totals = () => cart.reduce((t, l) => { const i = info(l); return { n: t.n + l.qty, sum: t.sum + i.total }; }, { n: 0, sum: 0 });

  /* ---------- squelette de l'app ---------- */
  const list = $("#pappList"), cats = $("#pappCats"), badge = $("#pappBadge"), cartBtn = $("#pappCartBtn");
  const bar = $("#pappBar"), toastEl = $("#pappToast"), sheet = $("#pappSheet");

  cats.innerHTML = CATS.map((c, i) => `<button type="button" class="papp__chip${i ? "" : " is-active"}" data-cat="${c.id}">${c.label}</button>`).join("");
  list.innerHTML = CATS.map((c) => `
    <section class="papp__group" id="pg-${c.id}" aria-label="${esc(c.label)}">
      <h3>${c.label}${c.sub ? ` <small>${c.sub}</small>` : ""}</h3>
      ${c.items.map((it) => `
        <article class="pitem" data-id="${it.id}">
          ${pic(it, "pitem__img")}
          <div class="pitem__txt">
            <h4>${esc(it.name)}</h4>
            ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
            <span class="pitem__price">${fromPrice(it)}</span>
          </div>
          <button class="pitem__add" type="button" aria-label="Ajouter ${esc(it.name)}">${ICON.plus}</button>
        </article>`).join("")}
    </section>`).join("") + `<p class="papp__end">Photos des pizzas et des bols : illustrations.</p>`;

  // statut ouvert / fermé (calculé par main.js à l'heure d'Alger)
  const hs = document.getElementById("hoursStatus");
  const isOpen = !hs || hs.classList.contains("is-open");
  const statusEl = $("#pappStatus");
  if (hs && !hs.hidden) {
    statusEl.textContent = isOpen ? "Ouvert · commande en ligne" : hs.textContent;
    statusEl.classList.add(isOpen ? "is-open" : "is-closed");
  }

  /* ---------- catégories : défilement + catégorie active ---------- */
  const setChip = (id) => {
    $$(".papp__chip").forEach((b) => {
      const on = b.dataset.cat === id;
      b.classList.toggle("is-active", on);
      if (on) cats.scrollTo({ left: b.offsetLeft - cats.clientWidth / 2 + b.offsetWidth / 2, behavior: smooth });
    });
  };
  let spyLock = 0;
  cats.addEventListener("click", (e) => {
    const b = e.target.closest(".papp__chip");
    if (!b) return;
    setChip(b.dataset.cat);
    spyLock = Date.now() + 700;
    list.scrollTo({ top: $(`#pg-${b.dataset.cat}`).offsetTop - 6, behavior: smooth });
  });
  list.addEventListener("scroll", () => {
    if (Date.now() < spyLock) return;
    let cur = CATS[0].id;
    $$(".papp__group").forEach((g) => { if (g.offsetTop - list.scrollTop <= 40) cur = g.id.slice(3); });
    if (!$(`.papp__chip.is-active[data-cat="${cur}"]`)) setChip(cur);
  }, { passive: true });

  /* ---------- feuille (options ou panier) ---------- */
  let mode = null, lastFocus = null;
  const openSheet = (html, kind) => {
    mode = kind;
    sheet.innerHTML = `<div class="psheet__panel psheet__panel--${kind}" role="dialog" aria-modal="true" aria-labelledby="pappSheetTitle">${html}</div>`;
    sheet.hidden = false;
    lastFocus = document.activeElement;
    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
      sheet.querySelector("button, input, textarea")?.focus({ preventScroll: true });
    });
  };
  const closeSheet = () => {
    if (!mode) return;
    mode = null;
    sheet.classList.remove("is-open");
    setTimeout(() => { if (!mode) { sheet.hidden = true; sheet.innerHTML = ""; } }, 380);
    lastFocus?.focus?.({ preventScroll: true });
  };
  sheet.addEventListener("click", (e) => { if (e.target === sheet || e.target.closest("[data-close]")) closeSheet(); });
  app.addEventListener("keydown", (e) => { if (e.key === "Escape" && mode) { e.stopPropagation(); closeSheet(); } });

  /* ---------- options d'un plat ---------- */
  const openOptions = (it) => {
    openSheet(`
      <span class="psheet__grab" aria-hidden="true"></span>
      <div class="psheet__head">
        ${pic(it, "psheet__img")}
        <div><h3 id="pappSheetTitle">${esc(it.name)}</h3>${it.desc ? `<p>${esc(it.desc)}</p>` : ""}</div>
        <button type="button" class="psheet__x" data-close aria-label="Fermer">${ICON.close}</button>
      </div>
      ${it.sizes ? `<fieldset class="popt"><legend>Taille <em>Obligatoire</em></legend>
        ${it.sizes.map((s, i) => `<label class="popt__row"><input type="radio" name="psize" value="${esc(s.label)}"${i ? "" : " checked"}><span>${esc(s.label)}</span><b>${da(s.price)}</b></label>`).join("")}
      </fieldset>` : ""}
      ${it.supps ? `<fieldset class="popt"><legend>Suppléments <em>Facultatif</em></legend>
        ${it.supps.map((s) => `<label class="popt__row"><input type="checkbox" name="psupp" value="${esc(s.name)}"><span>${esc(s.name)}</span><b>+${da(s.price)}</b></label>`).join("")}
      </fieldset>` : ""}
      <div class="psheet__foot">
        <div class="pqty"><button type="button" data-q="-1" aria-label="Une de moins">${ICON.minus}</button><output aria-live="polite">1</output><button type="button" data-q="1" aria-label="Une de plus">${ICON.plus}</button></div>
        <button type="button" class="psheet__add">Ajouter · <span></span></button>
      </div>`, "options");
    const panel = sheet.firstElementChild;
    let qty = 1;
    const choice = () => ({
      size: panel.querySelector('input[name="psize"]:checked')?.value ?? null,
      supps: [...panel.querySelectorAll('input[name="psupp"]:checked')].map((x) => x.value)
    });
    const price = () => { const c = choice(); return info({ id: it.id, size: c.size, supps: c.supps, qty }).total; };
    const upd = () => { panel.querySelector("output").textContent = qty; panel.querySelector(".psheet__add span").textContent = da(price()); };
    upd();
    panel.addEventListener("change", upd);
    panel.querySelectorAll(".pqty button").forEach((b) => b.addEventListener("click", () => { qty = Math.max(1, Math.min(20, qty + +b.dataset.q)); upd(); }));
    panel.querySelector(".psheet__add").addEventListener("click", () => {
      const c = choice();
      add(it, c.size, c.supps, qty);
      closeSheet();
    });
  };

  /* ---------- ajout au panier ---------- */
  let toastT;
  const toast = (t) => {
    toastEl.textContent = t;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 1600);
  };
  const add = (it, size, supps, qty) => {
    const key = [it.id, size || "", [...supps].sort().join("+")].join("|");
    const line = cart.find((l) => l.key === key);
    if (line) line.qty = Math.min(50, line.qty + qty);
    else cart.push({ key, id: it.id, size, supps, qty });
    save();
    refresh();
    toast(`${qty > 1 ? `${qty} × ` : ""}${it.name} ajouté ✓`);
    badge.classList.remove("is-bump"); void badge.offsetWidth; badge.classList.add("is-bump");
  };
  list.addEventListener("click", (e) => {
    const card = e.target.closest(".pitem");
    if (!card) return;
    const it = ITEMS[card.dataset.id];
    if (it.sizes || it.supps) openOptions(it);
    else add(it, null, [], 1);
  });

  /* ---------- panier ---------- */
  const form = { mode: "À emporter", nom: "", adresse: "", note: "" };
  const MODES = ["À emporter", "Sur place", "Livraison"];
  const renderCart = (focusSel) => {
    const { sum } = totals();
    const html = !cart.length ? `
      <div class="pcart__top"><h3 id="pappSheetTitle">Votre panier</h3><button type="button" class="psheet__x" data-close aria-label="Fermer">${ICON.close}</button></div>
      <div class="pcart__empty">${ICON.bag}<p>Votre panier est vide.</p><button type="button" class="pcart__back" data-close>Voir le menu</button></div>` : `
      <div class="pcart__top"><h3 id="pappSheetTitle">Votre panier</h3><button type="button" class="psheet__x" data-close aria-label="Fermer">${ICON.close}</button></div>
      <ul class="pcart__lines">
        ${cart.map((l, i) => { const x = info(l); return `
          <li class="cline">
            <div class="cline__txt"><b>${esc(x.it.name)}</b>${[l.size, ...x.supps.map((s) => `+ ${s.name}`)].filter(Boolean).length ? `<small>${esc([l.size, ...x.supps.map((s) => `+ ${s.name}`)].filter(Boolean).join(" · "))}</small>` : ""}<span>${da(x.total)}</span></div>
            <div class="pqty pqty--sm"><button type="button" data-line="${i}" data-q="-1" aria-label="Retirer un ${esc(x.it.name)}">${ICON.minus}</button><output>${l.qty}</output><button type="button" data-line="${i}" data-q="1" aria-label="Ajouter un ${esc(x.it.name)}">${ICON.plus}</button></div>
          </li>`; }).join("")}
      </ul>
      <div class="pcart__mode" role="radiogroup" aria-label="Mode de commande">
        ${MODES.map((m) => `<button type="button" role="radio" aria-checked="${m === form.mode}" class="${m === form.mode ? "is-on" : ""}" data-mode="${m}">${m}</button>`).join("")}
      </div>
      <label class="pfield"><span>Votre nom</span><input name="nom" autocomplete="name" placeholder="Facultatif" value="${esc(form.nom)}"></label>
      ${form.mode === "Livraison" ? `<label class="pfield"><span>Adresse de livraison *</span><textarea name="adresse" rows="2" autocomplete="street-address" placeholder="Rue, quartier, point de repère…">${esc(form.adresse)}</textarea></label>` : ""}
      <label class="pfield"><span>Note pour la cuisine</span><input name="note" placeholder="Ex. sans oignon, bien cuit…" value="${esc(form.note)}"></label>
      <div class="pcart__sum"><span>Total</span><b>${da(sum)}</b></div>
      ${form.mode === "Livraison" ? `<p class="pcart__hint">Frais de livraison à confirmer avec le restaurant.</p>` : ""}
      ${!isOpen && hs ? `<p class="pcart__hint pcart__hint--warn">${esc(hs.textContent)}.</p>` : ""}
      <p class="pcart__msg" id="pappMsg" role="status"></p>
      <button type="button" class="pcart__wa">${ICON.wa}Commander sur WhatsApp</button>
      <a class="pcart__call" href="tel:${D.phoneIntl}">ou appeler le ${D.phone}</a>
      <button type="button" class="pcart__clear">Vider le panier</button>`;
    if (mode !== "cart") openSheet(html, "cart");
    else sheet.firstElementChild.innerHTML = html;
    if (focusSel) sheet.querySelector(focusSel)?.focus({ preventScroll: true });
  };
  const message = () => {
    const { sum } = totals();
    const lines = cart.map((l) => {
      const x = info(l);
      const extra = [l.size ? `(${l.size})` : "", x.supps.length ? `+ ${x.supps.map((s) => s.name).join(", ")}` : ""].filter(Boolean).join(" ");
      return `• ${l.qty} × ${x.it.name}${extra ? ` ${extra}` : ""} : ${da(x.total)}`;
    });
    return [
      "Bonjour Hocine Chapati 👋",
      "Je voudrais commander :",
      ...lines,
      "",
      `Total : ${da(sum)}`,
      `Mode : ${form.mode}`,
      form.mode === "Livraison" ? `Adresse : ${form.adresse.trim()}` : null,
      form.nom.trim() ? `Nom : ${form.nom.trim()}` : null,
      form.note.trim() ? `Note : ${form.note.trim()}` : null
    ].filter((x) => x !== null).join("\n");
  };
  sheet.addEventListener("input", (e) => { if (mode === "cart" && e.target.name in form) form[e.target.name] = e.target.value; });
  sheet.addEventListener("click", (e) => {
    if (mode !== "cart") return;
    const q = e.target.closest("[data-line]");
    if (q) {
      const i = +q.dataset.line, d = +q.dataset.q;
      cart[i].qty = Math.min(50, cart[i].qty + d);
      const gone = cart[i].qty <= 0;
      if (gone) cart.splice(i, 1);
      save(); refresh();
      renderCart(gone ? ".psheet__x" : `[data-line="${i}"][data-q="${d}"]`);
      return;
    }
    const m = e.target.closest("[data-mode]");
    if (m) { form.mode = m.dataset.mode; renderCart(`[data-mode="${form.mode}"]`); return; }
    if (e.target.closest(".pcart__clear")) { cart = []; save(); refresh(); renderCart(".psheet__x"); return; }
    if (e.target.closest(".pcart__wa")) {
      const out = sheet.querySelector("#pappMsg");
      if (form.mode === "Livraison" && !form.adresse.trim()) {
        out.textContent = "Indiquez l'adresse de livraison.";
        out.className = "pcart__msg is-err";
        sheet.querySelector('textarea[name="adresse"]')?.focus({ preventScroll: true });
        return;
      }
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(message())}`, "_blank", "noopener");
      out.textContent = "WhatsApp s'ouvre avec votre commande : il ne reste qu'à envoyer le message.";
      out.className = "pcart__msg is-ok";
    }
  });
  cartBtn.addEventListener("click", () => renderCart());
  bar.addEventListener("click", () => renderCart());

  /* ---------- compteur, barre du bas ---------- */
  const refresh = () => {
    const { n, sum } = totals();
    badge.textContent = n;
    badge.hidden = !n;
    cartBtn.setAttribute("aria-label", `Voir le panier (${n} article${n > 1 ? "s" : ""})`);
    bar.classList.toggle("is-on", n > 0);
    bar.tabIndex = n ? 0 : -1;
    bar.setAttribute("aria-hidden", n ? "false" : "true");
    bar.innerHTML = `<span>Voir le panier</span><span>${n} article${n > 1 ? "s" : ""} · ${da(sum)}</span>`;
  };
  refresh();

  /* ---------- écran d'accueil : l'icône (logo) ouvre l'application ---------- */
  const screen = document.getElementById("mphoneScreen");
  const home = document.getElementById("phome");
  const icon = document.getElementById("phomeIcon");
  if (home && icon) {
    const hst = document.getElementById("phomeStatus");
    if (hs && !hs.hidden) { hst.textContent = hs.textContent; hst.classList.add(isOpen ? "is-open" : "is-closed"); }
    const opened = () => { home.hidden = true; app.inert = false; };
    // un client qui a déjà un panier retrouve directement la carte
    if (cart.length) { screen.classList.remove("is-home"); opened(); return; }
    app.inert = true;
    icon.addEventListener("click", () => {
      // l'application s'ouvre en grandissant depuis l'icône, comme sur un iPhone
      const s = screen.getBoundingClientRect(), i = icon.getBoundingClientRect();
      app.style.transformOrigin = `${i.left + i.width / 2 - s.left}px ${i.top + i.height / 2 - s.top}px`;
      home.classList.add("is-out");
      screen.classList.remove("is-home");
      setTimeout(() => { opened(); $(".papp__chip").focus({ preventScroll: true }); }, reduce ? 0 : 650);
    }, { once: true });
  }
})();
