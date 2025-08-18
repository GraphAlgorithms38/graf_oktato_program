// CSS selector alapján első elem kiválasztása
export const $ = (sel) => document.querySelector(sel);

// Új DOM elem létrehozása attribútumokkal és gyerekekkel
export const el = (tag, attrs = {}, ...children) => {
  const n = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else n.setAttribute(k, v);
  }

  children.forEach((c) => n.append(c));
  return n;
};

// Érték korlátozása adott intervallumra
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// Toast üzenet megjelenítése
export function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 6000);
}
