// BFS algoritmus lépéseinek kezelése
export function bfsSteps(graph, start = 0) {
  const steps = [];
  const visited = new Set(); // Bejárt csúcsok
  const frontier = new Set(); // Sorban lévő csúcsok
  const queue = []; // Sor (queue)

  queue.push(start);
  frontier.add(start);

  // Kezdő lépés rögzítése
  steps.push({
    phase: "Inicializálás",
    msg: `Kiindulás V${start} csúcsból. Sor: [${queue.join(", ")}]`,
    graph: { source: start, frontier: new Set(frontier) },
    tables: { main: [["Csúcs", "Állapot", "Megjegyzés"]], aux: [["Sor"]] },
  });

  while (queue.length) {
    const node = queue.shift(); // A sor elejéről kivesszük a következő csúcsot
    frontier.delete(node);
    visited.add(node);
    // Lépés rögzítése: csúcs feldolgozása
    steps.push({
      phase: "Kivétel a sorból",
      msg: `V${node} feldolgozása.`,
      graph: { source: start, nodes: new Set(visited) },
      tables: { aux: [["Sor", queue.join(", ")]] },
    });

    const neighbor = []; // Szomszédok listája

    // Szomszédos csúcsok kigyűjtése
    graph.edges.forEach((edge) => {
      if (edge.u === node) {
        neighbor.push({ to: edge.v, w: edge.w });
      }
      if (!graph.directed && edge.v === node) {
        neighbor.push({ to: edge.u, w: edge.w });
      }
    });

    neighbor.sort((a, b) => a.to - b.to); // Szomszédok rendezése

    for (const { to } of neighbor) {
      // Ha még nem jártunk egy adott csúcson és nincs a sorban
      if (!visited.has(to) && ![...frontier].includes(to)) {
        queue.push(to);
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
          tables: { aux: [["Sor", queue.join(", ")]] },
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
