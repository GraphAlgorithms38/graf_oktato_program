// Külön vizualizáció a Magyar módszerhez

export class HungarianView {
  constructor(svg) {
    this.svg = svg;
    this.n = 0;
    this._initSvg();
  }

  _initSvg() {
    this.svg.innerHTML = "";
    this.gEdges = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.gNodes = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.appendChild(this.gEdges);
    this.svg.appendChild(this.gNodes);
  }

  // A[i][j] > 0 -> él L_i – U_j
  setMatrix(A) {
    this._initSvg();
    const n = A.length;
    this.n = n;

    // Elrendezés: bal oldalon L0..L(n-1), jobb oldalon U0..U(n-1)
    const W = 1000,
      H = 700;
    const xL = 260,
      xU = 740;
    const top = 80,
      bottom = H - 80;
    const step = n > 1 ? (bottom - top) / (n - 1) : 0;

    this.posL = Array.from({ length: n }, (_, i) => ({
      x: xL,
      y: top + step * i,
    }));
    this.posU = Array.from({ length: n }, (_, j) => ({
      x: xU,
      y: top + step * j,
    }));

    // Élek
    this.gEdges.innerHTML = "";
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        if (Number(A[i][j]) > 0) {
          const u = this.posL[i],
            v = this.posU[j];
          const ln = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          ln.setAttribute("x1", u.x);
          ln.setAttribute("y1", u.y);
          ln.setAttribute("x2", v.x);
          ln.setAttribute("y2", v.y);
          ln.setAttribute("class", "edge");
          ln.setAttribute("data-edge", `${i}-${j}`);
          this.gEdges.appendChild(ln);
        }
      }

    // Csúcsok: L oldali
    this.gNodes.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const p = this.posL[i];
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "node bip L");
      g.setAttribute("data-side", "L");
      g.setAttribute("data-i", String(i));
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("cx", p.x);
      c.setAttribute("cy", p.y);
      c.setAttribute("r", 18);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", p.x);
      t.setAttribute("y", p.y + 4);
      t.textContent = "L" + i;
      g.appendChild(c);
      g.appendChild(t);
      this.gNodes.appendChild(g);
    }
    // Csúcsok: U oldali
    for (let j = 0; j < n; j++) {
      const p = this.posU[j];
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "node bip U");
      g.setAttribute("data-side", "U");
      g.setAttribute("data-i", String(j));
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("cx", p.x);
      c.setAttribute("cy", p.y);
      c.setAttribute("r", 18);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", p.x);
      t.setAttribute("y", p.y + 4);
      t.textContent = "U" + j;
      g.appendChild(c);
      g.appendChild(t);
      this.gNodes.appendChild(g);
    }
  }

  // A hungarianSteps() által megadott s.graph overlay kirajzolása
  // Használt css osztályok:
  //  - .edge.highlight  (párosított élek)
  //  - .node.visited    (L oldal címkézett)
  //  - .node.source     (U oldal címkézett)
  //  - .node.frontier   (sor/frontier jelölés)
  renderOverlay(info) {
    if (!info || info.type !== "hungarian") return;

    // Reset osztályok
    [...this.gNodes.querySelectorAll(".node")].forEach((nd) => {
      nd.classList.remove("visited", "source", "frontier");
    });
    [...this.gEdges.querySelectorAll("line")].forEach((ln) => {
      ln.classList.remove("highlight");
    });

    // Címkézettek
    if (Array.isArray(info.labelsL)) {
      info.labelsL.forEach((flag, i) => {
        if (flag) {
          const nd = this.gNodes.querySelector(`.node.L[data-i="${i}"]`);
          if (nd) nd.classList.add("visited"); // L-címke -> már látogatott (zöld keret)
        }
      });
    }
    if (Array.isArray(info.labelsU)) {
      info.labelsU.forEach((flag, j) => {
        if (flag) {
          const nd = this.gNodes.querySelector(`.node.U[data-i="${j}"]`);
          if (nd) nd.classList.add("source"); // U-címke -> forrás (kék keret)
        }
      });
    }
    // Sor/frontier
    if (Array.isArray(info.frontierL)) {
      info.frontierL.forEach((i) => {
        const nd = this.gNodes.querySelector(`.node.L[data-i="${i}"]`);
        if (nd) nd.classList.add("frontier"); // sárga keret
      });
    }
    if (Array.isArray(info.frontierU)) {
      info.frontierU.forEach((j) => {
        const nd = this.gNodes.querySelector(`.node.U[data-i="${j}"]`);
        if (nd) nd.classList.add("frontier");
      });
    }

    // Párosított élek
    if (Array.isArray(info.matched)) {
      info.matched.forEach(([i, j]) => {
        const ln = this.gEdges.querySelector(`line[data-edge="${i}-${j}"]`);
        if (ln) ln.classList.add("highlight"); // meglévő accent kiemelése
      });
    }
  }
}
