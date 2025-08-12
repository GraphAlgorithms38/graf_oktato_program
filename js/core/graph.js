// Gráf osztály: csúcsok és élek tárolása
export class Graph {
  constructor(n, directed = false) {
    this.n = n;
    this.directed = directed;
    // Csúcsok inicializálása (id, x, y)
    this.nodes = [...Array(n)].map((_, i) => ({ id: i, x: 0, y: 0 }));
    // Élek listája: {u, v, w}
    this.edges = [];
  }
  // Gráf létrehozása szomszédsági mátrixból
  static fromAdj(A, directed = false) {
    const n = A.length;
    const g = new Graph(n, directed);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const w = A[i][j];
        if (w !== 0) {
          // Csak egyszer vesszük fel, ha nem irányított
          if (directed || i < j) g.edges.push({ u: i, v: j, w });
        }
      }
    return g;
  }
}
