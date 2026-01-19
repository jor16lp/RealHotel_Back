export function precisionAtK(recommended, relevant, k) {
  if (!relevant.length) return 0;

  const topK = recommended.slice(0, k);
  const hits = topK.filter(h => relevant.includes(h)).length;

  return hits / k;
}

export function recallAtK(recommended, relevant, k) {
  if (!relevant.length) return 0;

  const topK = recommended.slice(0, k);
  const hits = topK.filter(h => relevant.includes(h)).length;

  return hits / relevant.length;
}

export function ndcgAtK(recommended, relevant, k) {
  if (!relevant.length) return 0;

  let dcg = 0;
  for (let i = 0; i < Math.min(k, recommended.length); i++) {
    if (relevant.includes(recommended[i])) {
      dcg += 1 / Math.log2(i + 2);
    }
  }

  let idcg = 0;
  for (let i = 0; i < Math.min(k, relevant.length); i++) {
    idcg += 1 / Math.log2(i + 2);
  }

  return idcg === 0 ? 0 : dcg / idcg;
}