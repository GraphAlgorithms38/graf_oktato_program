// Algoritmus-specifikus ellenőrzések
// visszatérési érték: { ok:boolean, errors:string[], warnings:string[] }

// Van-e negatív él a gráfban
function hasNegativeEdge(g) {
  return g.edges.some((e) => e.w < 0);
}
// Van-e 0 súlyú él a gráfban
function hasZeroWeightEdge(g) {
  return g.edges.some((e) => e.w === 0);
}

// Algoritmusok validálása
export function validateAlgo(id, ctx) {
  const out = { ok: true, errors: [], warnings: [] };
  const { g } = ctx;

  switch (id) {
    case "dijkstra":
      // a Dijkstra algoritmus nem engedélyezi a negatív él-súlyt
      if (hasNegativeEdge(g))
        out.errors.push(
          "Dijkstra: negatív él-súly található. Csak pozitív súlyok használhatók."
        );
      // 0 súlyú él sem engedélyezett
      if (hasZeroWeightEdge(g))
        out.errors.push("Dijkstra: 0 súlyú él nem engedélyezett.");
      break;
  }

  if (out.errors.length) out.ok = false;
  return out;
}
