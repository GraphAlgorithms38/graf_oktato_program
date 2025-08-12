// Dijkstra algoritmus lépéseinek kezelése
export function dijkstraSteps(g, start = 0) {
  const n = g.n;
  const dist = Array(n).fill(Infinity); // Távolságok tömbje
  const prev = Array(n).fill(null); // Előző elemek tömbje
  const used = new Set(); // Rögzített csúcsok
  dist[start] = 0;
  const steps = [];

  // Kezdő lépés rögzítése
  steps.push({
    phase: "Inicializálás",
    msg: `Kezdőcsúcs: V${start}. Kezdeti d táblázat.`,
    graph: { source: start },
    tables: {
      main: [["Csúcs", "d", "előd"]].concat(
        dist.map((d, i) => [
          "V" + i,
          d === Infinity ? "∞" : d,
          prev[i] === null ? "–" : "V" + prev[i],
        ])
      ),
    },
  });

  // Szomszédok kigyűjtése egy csúcsból
  function neighbors(v) {
    const res = [];
    g.edges.forEach((e) => {
      if (e.u === v) res.push([e.v, e.w, e]);
      if (!g.directed && e.v === v) res.push([e.u, e.w, e]);
    });
    return res;
  }

  while (used.size < n) {
    let v = -1,
      best = Infinity;

    // Legkisebb távolságú, még nem rögzített csúcs keresése
    for (let i = 0; i < n; i++)
      if (!used.has(i) && dist[i] < best) {
        best = dist[i];
        v = i;
      }
    if (v === -1) {
      break;
    }

    used.add(v);

    // Lépés rögzítése: csúcs rögzítése
    steps.push({
      phase: "Kiválasztás",
      msg: `V${v} rögzítve (d=${best}).`,
      graph: { source: start, nodes: new Set(used) },
      tables: {
        main: [["Csúcs", "d", "előd"]].concat(
          dist.map((d, i) => [
            "V" + i,
            d === Infinity ? "∞" : d,
            prev[i] === null ? "–" : "V" + prev[i],
          ])
        ),
      },
    });

    // Szomszédok bejárása
    for (const [to, w] of neighbors(v)) {
      if (used.has(to)) {
        continue;
      }

      const nd = dist[v] + w;

      // Ha rövidebb utat találtunk, frissítjük
      if (nd < dist[to]) {
        dist[to] = nd;
        prev[to] = v;
        // Lépés rögzítése: nyújtás
        steps.push({
          phase: "Nyújtás",
          msg: `V${v}→V${to} nyújtás: új d[V${to}]=${nd}.`,
          graph: {
            source: start,
            nodes: new Set(used),
            edges: new Set([`${v}-${to}`]),
          },
          tables: {
            main: [["Csúcs", "d", "előd"]].concat(
              dist.map((d, i) => [
                "V" + i,
                d === Infinity ? "∞" : d,
                prev[i] === null ? "–" : "V" + prev[i],
              ])
            ),
          },
        });
      }
    }
  }

  // Befejező lépés rögzítése
  steps.push({
    phase: "Kész",
    msg: "Dijkstra kész.",
    graph: { source: start },
    tables: {
      main: [["Csúcs", "d", "előd"]].concat(
        dist.map((d, i) => [
          "V" + i,
          d === Infinity ? "∞" : d,
          prev[i] === null ? "–" : "V" + prev[i],
        ])
      ),
    },
  });

  return steps;
}
