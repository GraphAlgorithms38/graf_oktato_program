// Algoritmus-specifikus ellenőrzések
// return { ok:boolean, errors:string[], warnings:string[] }

function hasNegativeEdge(g) {
  return g.edges.some((e) => e.w < 0);
}
function hasZeroWeightEdge(g) {
  return g.edges.some((e) => e.w === 0);
}

export function validateAlgo(id, ctx) {
  const out = { ok: true, errors: [], warnings: [] };
  const { g } = ctx;

  switch (id) {
    case "dijkstra":
      if (hasNegativeEdge(g))
        out.errors.push(
          "Dijkstra: negatív él-súly található. Csak pozitív súlyok használhatók."
        );
      // Szigorítás: 0 súlyú él tiltása (pozitív súlyokat várunk)
      if (hasZeroWeightEdge(g))
        out.errors.push("Dijkstra: 0 súlyú él nem engedélyezett.");
      break;
  }

  if (out.errors.length) out.ok = false;
  return out;
}
