// CSS selector alapján első elem kiválasztása
export const $ = (sel) => document.querySelector(sel);

// Új DOM elem létrehozása attribútumokkal és gyerekekkel
export const el = (tag, attrs = {}, ...children) => {
  const element = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") element.className = v;
    else if (k === "html") element.innerHTML = v;
    else element.setAttribute(k, v);
  }

  children.forEach((c) => element.append(c));
  return element;
};

// Érték korlátozása adott intervallumra
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// Toast üzenet megjelenítése
export function toast(msg) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 6000);
}
