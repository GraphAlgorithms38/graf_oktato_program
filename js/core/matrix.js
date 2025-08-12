import { el, $ } from "../utils/dom.js";

// Mátrix osztály
export class MatrixEditor {
  constructor(root) {
    this.root = root;
    this.n = +$("#n").value; // Csúcsok száma
    this.directed = $("#directed").checked; // Irányítottság
    this.weighted = $("#weighted").checked; // Súlyozottság
    this.build();
  }
  build() {
    this.root.innerHTML = "";
    const tbl = el("table");
    const thead = el("thead");
    const trh = el("tr");
    trh.append(el("th", { html: "i/j" }));

    // Fejléc feltöltése csúcsokkal
    for (let j = 0; j < this.n; j++) {
      trh.append(el("th", { html: "V" + j }));
    }

    thead.append(trh);
    tbl.append(thead);

    const tbody = el("tbody");
    for (let i = 0; i < this.n; i++) {
      const tr = el("tr");
      tr.append(el("th", { html: "V" + i }));
      for (let j = 0; j < this.n; j++) {
        // Mátrix cella input létrehozása
        const inp = el("input", {
          type: "number",
          value: i === j ? 0 : 0,
          step: "1",
          id: `cell-${i}-${j}`,
        });
        // Szimmetrikus kitöltés, ha nem irányított
        inp.addEventListener("input", () => {
          if (!this.directed && i !== j) {
            const sym = this.root.querySelector(`#cell-${j}-${i}`);
            if (sym) sym.value = inp.value;
          }
        });
        tr.append(el("td", {}, inp));
      }
      tbody.append(tr);
    }
    tbl.append(tbody);
    this.root.append(tbl);
  }
  // Mátrix átméretezése
  resize(n) {
    this.n = n;
    this.build();
  }
  // Mátrix kiolvasása 2D tömbbe
  toMatrix() {
    const A = [...Array(this.n)].map(() => Array(this.n).fill(0));
    for (let i = 0; i < this.n; i++)
      for (let j = 0; j < this.n; j++) {
        const raw = this.root.querySelector(`#cell-${i}-${j}`).value;
        const v = raw === "" ? 0 : Number(raw);
        A[i][j] = Number.isFinite(v) ? v : 0;
      }
    return A;
  }
  // Véletlen mátrix generálása
  randomize() {
    const directed = $("#directed").checked;
    for (let i = 0; i < this.n; i++)
      for (let j = 0; j < this.n; j++) {
        if (i === j) {
          this.root.querySelector(`#cell-${i}-${j}`).value = 0;
          continue;
        }
        const put = Math.random() < 0.5 ? 0 : 1 + Math.floor(Math.random() * 9);
        this.root.querySelector(`#cell-${i}-${j}`).value = put;
        if (!directed) this.root.querySelector(`#cell-${j}-${i}`).value = put;
      }
  }
  // Mátrix törlése (nullázás)
  clear() {
    for (let i = 0; i < this.n; i++)
      for (let j = 0; j < this.n; j++)
        this.root.querySelector(`#cell-${i}-${j}`).value = i === j ? 0 : 0;
  }
}
