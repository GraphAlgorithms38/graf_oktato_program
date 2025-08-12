// Gráf vizualizációs osztály (SVG)
export class GraphView {
  constructor(svg, { onNodeDblClick } = {}) {
    this.svg = svg;
    this.g = null;
    this.pos = [];
    // Kiemelések (pl. bejárt csúcsok, élek)
    this.highlight = {
      nodes: new Set(),
      edges: new Set(),
      source: null,
      frontier: new Set(),
    };
    this.onNodeDblClick = onNodeDblClick || (() => {});
  }
  setGraph(g) {
    this.g = g;
    this.layoutCircle();
    this.render();
  }
  // Csúcsok kör alakú elrendezése
  layoutCircle() {
    const W = 1000,
      H = 700,
      cx = W / 2,
      cy = H / 2,
      r = Math.min(W, H) * 0.36;
    const n = this.g.n;
    this.pos = [...Array(n)].map((_, i) => {
      const ang = (i / n) * 2 * Math.PI - Math.PI / 2;
      return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
    });
    this.g.nodes.forEach((nd, i) => {
      nd.x = this.pos[i].x;
      nd.y = this.pos[i].y;
    });
  }
  // Él azonosító generálása
  _edgeId(e) {
    return `${e.u}-${e.v}`;
  }
  render() {
    const svg = this.svg;
    svg.innerHTML = "";
    if (!this.g) return;
    // Nyílhegy definiálása
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );
    marker.setAttribute("id", "arrow");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("orient", "auto-start-reverse");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    path.setAttribute("fill", "#334155");
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Élek kirajzolása
    this.g.edges.forEach((e) => {
      const a = this.g.nodes[e.u],
        b = this.g.nodes[e.v];
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x);
      line.setAttribute("y2", b.y);
      line.setAttribute(
        "class",
        `edge ${this.highlight.edges.has(this._edgeId(e)) ? "highlight" : ""}`
      );
      if (this.g.directed) line.setAttribute("marker-end", "url(#arrow)");
      svg.appendChild(line);
      // Súly címke az él közepén
      const midx = (a.x + b.x) / 2,
        midy = (a.y + b.y) / 2;
      const gg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gg.setAttribute("class", "edge weight");
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("x", midx - 10);
      bg.setAttribute("y", midy - 10);
      bg.setAttribute("rx", 6);
      bg.setAttribute("ry", 6);
      bg.setAttribute("width", 24);
      bg.setAttribute("height", 18);
      bg.setAttribute("fill", "#0a0f1d");
      bg.setAttribute("stroke", "#1f2937");
      const tt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      tt.setAttribute("x", midx + 2);
      tt.setAttribute("y", midy + 3);
      tt.setAttribute("text-anchor", "middle");
      tt.textContent = e.w;
      gg.appendChild(bg);
      gg.appendChild(tt);
      svg.appendChild(gg);
    });

    // Csúcsok kirajzolása
    this.g.nodes.forEach((nd, i) => {
      const gg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gg.setAttribute(
        "class",
        `node ${this.highlight.nodes.has(i) ? "visited" : ""} ${
          this.highlight.frontier.has(i) ? "frontier" : ""
        } ${this.highlight.source === i ? "source" : ""}`
      );
      gg.setAttribute("transform", `translate(${nd.x},${nd.y})`);
      gg.addEventListener("dblclick", () => this.onNodeDblClick(i));
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      c.setAttribute("r", 22);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dy", ".35em");
      t.textContent = "V" + i;
      gg.appendChild(c);
      gg.appendChild(t);
      svg.appendChild(gg);
    });
  }
  // Kiemelések beállítása és újrarajzolás
  setHighlights({
    nodes = new Set(),
    edges = new Set(),
    source = null,
    frontier = new Set(),
  } = {}) {
    this.highlight = { nodes, edges, source, frontier };
    this.render();
  }
}
