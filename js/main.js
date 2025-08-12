import { $, el, clamp, toast } from "./utils/dom.js";
import { Stepper } from "./utils/stepper.js";
import { Graph } from "./core/graph.js";
import { GraphView } from "./core/view.js";
import { MatrixEditor } from "./core/matrix.js";
import { validateAlgo } from "./validation.js";
import { loadAlgorithm } from "./modules.js";

const algoCache = new Map();

async function getAlgorithm(id) {
  if (algoCache.has(id)) {
    return algoCache.get(id);
  }

  const mod = await loadAlgorithm(id);
  algoCache.set(id, mod);
  return mod;
}

const Matrix = new MatrixEditor($("#matrix"));
const View = new GraphView($("#graphSvg"), {
  onNodeDblClick: (i) => UI.setStart(i),
});

const Steps = new Stepper();
Steps.onApply = (s, idx, total) => UI.renderStep(s, idx, total);

function renderBuildSteps(A, directed) {
  const tb = $("#buildTbody");
  tb.innerHTML = "";
  const ops = [];
  const n = A.length;
  ops.push([
    "Inicializálás",
    `Mátrix beolvasása (${n}×${n}), irányított=${directed}.`,
  ]);

  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (A[i][j] !== 0)
        ops.push(["Él létrehozása", `V${i} → V${j} súly/kapacitás ${A[i][j]}`]);
  ops.forEach((r, idx) => {
    const tr = el("tr", { class: idx === 0 ? "highlight" : "" });

    tr.append(
      el("td", { html: String(idx) }),
      el("td", { html: r[0] }),
      el("td", { html: r[1] })
    );

    tb.append(tr);
  });
}

function tableFrom(data) {
  const table = el("table");
  const thead = el("thead");
  const tbody = el("tbody");

  if (!data || data.length === 0) {
    return el("div", {}, el("div", { class: "hint", html: "—" }));
  }

  const head = data[0];
  const thr = el("tr");
  head.forEach((h) => thr.append(el("th", { html: String(h) })));
  thead.append(thr);

  for (let i = 1; i < data.length; i++) {
    const tr = el("tr");
    data[i].forEach((cell) => tr.append(el("td", { html: String(cell) })));
    tbody.append(tr);
  }
  table.append(thead, tbody);

  return table;
}

const UI = {
  graph: null,
  currentAlgorithm: "bfs",
  startNode: 0,
  targetNode: 1,
  setStart(i) {
    this.startNode = i;
    toast(`Kezdőcsúcs: V${i}`);
    View.setHighlights({ source: i });
    this.runAlgorithm();
  },
  setTarget(i) {
    this.targetNode = i;
    toast(`Célcsúcs: V${i}`);
    this.runAlgorithm();
  },
  async runAlgorithm() {
    const A = Matrix.toMatrix();
    const directed = $("#directed").checked;
    // mindig újrageneráljuk a gráfot az aktuális mátrixból
    const g = Graph.fromAdj(A, directed);
    this.graph = g;
    View.setGraph(g);

    // validáció
    const { ok, errors, warnings } = validateAlgo(this.currentAlgorithm, {
      g,
      A,
      start: this.startNode,
      target: this.targetNode,
    });

    if (warnings.length) {
      warnings.forEach((w) => toast("Figyelmeztetés: " + w));
    }

    if (!ok) {
      $("#explain").textContent = "Hiba: " + errors.join(" | ");
      $("#auxTableWrap").innerHTML = "";
      $("#stepKpi").textContent = "–";
      $("#phaseKpi").textContent = "Hiba";
      return;
    }

    // algoritmus futtatása
    const mod = await getAlgorithm(this.currentAlgorithm);
    let steps = [];
    if (this.currentAlgorithm === "bfs") {
      steps = mod.bfsSteps(g, this.startNode);
    } else if (this.currentAlgorithm === "dijkstra") {
      steps = mod.dijkstraSteps(g, this.startNode);
    }
    Steps.load(steps);
  },

  renderStep(s, idx, total) {
    $("#stepKpi").textContent = `${idx + 1}/${total || "–"}`;
    $("#phaseKpi").textContent = s ? s.phase : "–";
    $("#explain").textContent = s ? s.msg : "—";
    $("#auxTableWrap").innerHTML = "";
    if (s && s.tables && s.tables.aux)
      $("#auxTableWrap").append(tableFrom(s.tables.aux));
    if (this.graph) {
      const hi = {
        nodes: s?.graph?.nodes || new Set(),
        edges: s?.graph?.edges || new Set(),
        source: s?.graph?.source ?? View.highlight.source,
        frontier: s?.graph?.frontier || new Set(),
      };
      View.setHighlights(hi);
    }
  },
};

// Vezérlők
function refreshAdjFlags() {
  Matrix.directed = $("#directed").checked;
  Matrix.weighted = $("#weighted").checked;
}

$("#resize").addEventListener("click", () => {
  const n = clamp(+$("#n").value, 2, 12);
  Matrix.resize(n);
});

$("#randomize").addEventListener("click", () => Matrix.randomize());

$("#clear").addEventListener("click", () => Matrix.clear());

$("#directed").addEventListener("change", () => {
  refreshAdjFlags();
  toast($("#directed").checked ? "Irányított mód" : "Irányítatlan mód");
});

$("#weighted").addEventListener("change", () => {
  refreshAdjFlags();
  toast($("#weighted").checked ? "Súlyok használata" : "Súlyok nélkül");
});

$("#buildGraph").addEventListener("click", () => {
  const A = Matrix.toMatrix();
  const directed = $("#directed").checked;
  const g = Graph.fromAdj(A, directed);
  UI.graph = g;
  View.setGraph(g);
  renderBuildSteps(A, directed);
  toast("Gráf felépítve.");
  UI.startNode = 0;
  UI.targetNode = Math.min(1, g.n - 1);
  View.setHighlights({ source: 0 });
});

$("#next").addEventListener("click", () => Steps.next());
$("#prev").addEventListener("click", () => Steps.prev());
$("#reset").addEventListener("click", () => Steps.reset());
$("#play").addEventListener("click", () => Steps.play());

const ALGOS = [
  {
    id: "bfs",
    name: "Szélességi (BFS)",
    params: () =>
      el(
        "div",
        {},
        el("label", { html: "Kiindulási csúcs száma:" }),
        (() => {
          const s = el("input", {
            type: "number",
            min: 0,
            max: Matrix.n - 1,
            value: UI.startNode,
          });
          s.addEventListener("input", () => {
            UI.setStart(clamp(+s.value, 0, Matrix.n - 1));
          });
          return s;
        })()
      ),
  },
  {
    id: "dijkstra",
    name: "Dijkstra",
    params: () =>
      el(
        "div",
        {},
        el("label", { html: "Start:" }),
        (() => {
          const s = el("input", {
            type: "number",
            min: 0,
            max: Matrix.n - 1,
            value: UI.startNode,
          });
          s.addEventListener("input", () => {
            UI.setStart(clamp(+s.value, 0, Matrix.n - 1));
          });
          return s;
        })()
      ),
  },
];

function renderTabs() {
  const wrap = $("#algoTabs");
  wrap.innerHTML = "";
  ALGOS.forEach((a) => {
    const b = el("div", {
      class: "tab" + (UI.currentAlgorithm === a.id ? " active" : ""),
      html: a.name,
    });
    b.addEventListener("click", () => {
      UI.currentAlgorithm = a.id;
      renderTabs();
      renderParams();
      UI.runAlgorithm();
    });
    wrap.append(b);
  });
}

function renderParams() {
  const p = $("#algoParams");
  p.innerHTML = "";
  const conf = ALGOS.find((x) => x.id === UI.currentAlgorithm);
  if (conf && conf.params) p.append(conf.params());
}

renderTabs();
renderParams();

// Inicializáció
Matrix.randomize();
document.querySelector("#buildGraph").click();
UI.currentAlgorithm = "bfs";
renderTabs();
UI.runAlgorithm();
