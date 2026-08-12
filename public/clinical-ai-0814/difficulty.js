export const difficultyLabels = ["太簡單", "簡單", "OK", "困難", "聽不懂"];

export function renderDifficultyChart(root, difficulty = {}) {
  if (!root) return;
  const counts = Array.isArray(difficulty.counts) ? difficulty.counts.slice(0, 5) : [];
  while (counts.length < 5) counts.push(0);
  const total = Number(difficulty.total) || 0;
  const average = Number(difficulty.average);
  const max = Math.max(1, ...counts);
  const baseline = 170;
  const points = counts.map((count, index) => ({
    x: 30 + index * 135,
    y: baseline - (count / max) * 125,
  }));
  const line = smoothCurve(points);
  root.querySelector("[data-difficulty-line]")?.setAttribute("d", line);
  root
    .querySelector("[data-difficulty-area]")
    ?.setAttribute("d", `M ${points[0].x} ${baseline} L ${line.slice(2)} L 570 ${baseline} Z`);
  const pointsRoot = root.querySelector("[data-difficulty-points]");
  if (pointsRoot) {
    pointsRoot.innerHTML = points
      .map(
        (point, index) =>
          `<circle cx="${point.x}" cy="${point.y}" r="7"></circle><text x="${point.x}" y="${Math.max(24, point.y - 15)}">${counts[index]}</text>`,
      )
      .join("");
  }
  const countsRoot = root.querySelector("[data-difficulty-counts]");
  if (countsRoot) {
    countsRoot.innerHTML = difficultyLabels
      .map((label, index) => `<span><b>${counts[index]}</b><small>${label}</small></span>`)
      .join("");
  }
  const totalRoot = root.querySelector("[data-difficulty-total]");
  if (totalRoot) {
    totalRoot.textContent = total
      ? `${total} 人回報 · 平均 ${Number.isFinite(average) ? average.toFixed(1) : "-"}`
      : "等待第一個回報";
  }
}

function smoothCurve(points) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const middleX = (previous.x + point.x) / 2;
    return `${path} C ${middleX} ${previous.y}, ${middleX} ${point.y}, ${point.x} ${point.y}`;
  }, "");
}
