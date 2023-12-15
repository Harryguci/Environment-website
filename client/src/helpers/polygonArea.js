function polygonArea(points) {
  let area = 0;
  let n = points.length;
  for (let i = 0; i < n; i++) {
    let j = (i + 1) % n;
    area += (points[i][0] + points[j][0]) * (points[i][1] - points[j][1]);
  }
  return Math.abs(area / 2);
}

export default polygonArea;
