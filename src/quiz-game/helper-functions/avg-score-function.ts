export function formatAvgScore(score) {
  return parseFloat(score.toFixed(2))
    .toString()
    .replace(/\.?0+$/, '');
}
