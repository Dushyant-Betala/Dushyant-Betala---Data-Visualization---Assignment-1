import { SPARKLINE } from "./config.js";

/**
 * Draws two mini line charts inside every heatmap cell:
 * the daily maximum and the daily minimum temperature of that month.
 *
 * x = day of the month, y = temperature. All cells share the same y-scale,
 * so line heights can be compared between months and years.
 *
 * @param cells  the cell <g> selection returned by drawHeatmap()
 * @param {object} size
 * @param {number} size.cellWidth   width of one cell in px
 * @param {number} size.cellHeight  height of one cell in px
 * @param {[number, number]} size.temperatureExtent  [lowest, highest] daily temperature drawn
 */
export function drawSparklines(cells, { cellWidth, cellHeight, temperatureExtent }) {
  const { inset, daysInLongestMonth } = SPARKLINE;

  const dayScale = d3
    .scaleLinear()
    .domain([1, daysInLongestMonth])
    .range([inset, cellWidth - inset]);

  const temperatureScale = d3
    .scaleLinear()
    .domain(temperatureExtent)
    .range([cellHeight - inset, inset]);

  const lineFor = (valueOf) =>
    d3.line()
      .x((day) => dayScale(day.day))
      .y((day) => temperatureScale(valueOf(day)));

  const series = [
    { className: "sparkline--max", color: SPARKLINE.maxLineColor, line: lineFor((d) => d.maxTemperature) },
    { className: "sparkline--min", color: SPARKLINE.minLineColor, line: lineFor((d) => d.minTemperature) },
  ];

  for (const { className, color, line } of series) {
    cells
      .append("path")
      .attr("class", `sparkline ${className}`)
      .attr("stroke", color)
      .attr("d", (month) => line(month.days));
  }
}
