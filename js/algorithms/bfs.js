// BFS algoritmus lépéseinek kezelése
export function bfsSteps(g, start = 0) {
  const steps = [];
  const visited = new Set(); // Bejárt csúcsok
  const frontier = new Set(); // Sorban lévő csúcsok
  const q = []; // Sor (queue)

  q.push(start);
  frontier.add(start);

  // Kezdő lépés rögzítése
  steps.push({
    phase: "Inicializálás",
    msg: `Kiindulás V${start} csúcsból. Sor: [${q.join(", ")}]`,
    graph: { source: start, frontier: new Set(frontier) },
    tables: { main: [["Csúcs", "Állapot", "Megjegyzés"]], aux: [["Sor"]] },
  });

  while (q.length) {
    const v = q.shift(); // A sor elejéről kivesszük a következő csúcsot
    frontier.delete(v);
    visited.add(v);
    // Lépés rögzítése: csúcs feldolgozása
    steps.push({
      phase: "Kivétel a sorból",
      msg: `V${v} feldolgozása.`,
      graph: { source: start, nodes: new Set(visited) },
      tables: { aux: [["Sor", q.join(", ")]] },
    });

    const neighbor = []; // Szomszédok listája

    // Szomszédos csúcsok kigyűjtése
    g.edges.forEach((e) => {
      if (e.u === v) {
        neighbor.push({ to: e.v, w: e.w });
      }
      if (!g.directed && e.v === v) {
        neighbor.push({ to: e.u, w: e.w });
      }
    });

    neighbor.sort((a, b) => a.to - b.to); // Szomszédok rendezése

    for (const { to } of neighbor) {
      // Ha még nem jártunk egy adott csúcson és nincs a sorban
      if (!visited.has(to) && ![...frontier].includes(to)) {
        q.push(to);
        frontier.add(to);
        // Lépés rögzítése: szomszéd beillesztése a sorba
        steps.push({
          phase: "Szomszéd bejárása",
          msg: `V${to} beillesztése a sor végére.`,
          graph: {
            source: start,
            nodes: new Set(visited),
            frontier: new Set(frontier),
          },
          tables: { aux: [["Sor", q.join(", ")]] },
        });
      }
    }
  }

  // Befejező lépés rögzítése
  steps.push({
    phase: "Kész",
    msg: `Minden elérhető csúcs bejárva: {${[...visited]
      .map((i) => "V" + i)
      .join(", ")}}.`,
    graph: { source: start, nodes: new Set(visited) },
  });

  return steps;
}
