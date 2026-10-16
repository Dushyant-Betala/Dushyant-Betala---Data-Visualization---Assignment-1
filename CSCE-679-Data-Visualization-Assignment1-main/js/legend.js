/**
 * Legends drawn to the right of the heatmap.
 */
import { COLOR, LEGEND, SPARKLINE } from "./config.js";

/**
 * Draws a vertical stepped colour legend: one swatch per palette colour,
 * coldest at the top. Hovering a swatch shows the temperature range it covers.
 *
 * @param heatmap  object returned by drawHeatmap()
 * @param colorScale  the quantize scale used to colour the cells
 * @returns {number} the legend's bottom y-coordinate, so other keys can be stacked below it
 */
export function drawColorLegend(heatmap, colorScale) {
  const { swatchWidth, swatchHeight, labelGap, unit } = LEGEND;
  const colors = colorScale.range();
  const legendHeight = colors.length * swatchHeight;
  const [topLabel, bottomLabel] = COLOR.legendLabelRange;

  const legend = heatmap.svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${legendX(heatmap)},${heatmap.margin.top})`);

  legend
    .selectAll("rect")
    .data(colors)
    .join("rect")
    .attr("y", (_, i) => i * swatchHeight)
    .attr("width", swatchWidth)
    .attr("height", swatchHeight)
    .attr("fill", (color) => color)
    .append("title")
    .text((color, i) => describeSwatchRange(colorScale, color, i, colors.length));

  legend
    .append("text")
    .attr("x", swatchWidth + labelGap)
    .attr("y", 0)
    .attr("dy", "0.8em")   // hang the text below the top edge
    .text(`${topLabel} ${unit}`);

  legend
    .append("text")
    .attr("x", swatchWidth + labelGap)
    .attr("y", legendHeight)
    .attr("dy", "1em")     // place the text just under the last swatch
    .text(`${bottomLabel} ${unit}`);

  return heatmap.margin.top + legendHeight;
}

/**
 * Hover text for one legend swatch. The first and last bins also hold every
 * value beyond the scale's domain, so they are described as open-ended.
 */
function describeSwatchRange(colorScale, color, index, swatchCount) {
  const [from, to] = colorScale.invertExtent(color).map((t) => t.toFixed(LEGEND.rangeDecimals));
  if (index === 0) return `below ${to} °C`;
  if (index === swatchCount - 1) return `${from} °C and above`;
  return `${from} – ${to} °C`;
}

/**
 * Small key explaining the two sparkline colours (Level 2 only).
 * @param heatmap  object returned by drawHeatmap()
 * @param {number} top  y-coordinate to start drawing at
 */
export function drawSparklineKey(heatmap, top) {
  const { rowHeight, lineLength, lineWidth, labelGap } = LEGEND.sparklineKey;
  const entries = [
    { label: "Daily max", color: SPARKLINE.maxLineColor },
    { label: "Daily min", color: SPARKLINE.minLineColor },
  ];

  const key = heatmap.svg
    .append("g")
    .attr("class", "legend legend--lines")
    .attr("transform", `translate(${legendX(heatmap)},${top})`);

  const rows = key
    .selectAll("g")
    .data(entries)
    .join("g")
    .attr("transform", (_, i) => `translate(0,${i * rowHeight})`);

  rows
    .append("line")
    .attr("x2", lineLength)
    .attr("stroke", (entry) => entry.color)
    .attr("stroke-width", lineWidth);

  rows
    .append("text")
    .attr("x", lineLength + labelGap)
    .attr("dy", "0.35em")  // vertically centre the text on the line
    .text((entry) => entry.label);
}

/** x-coordinate (in svg space) where legends start, just right of the matrix. */
function legendX(heatmap) {
  return heatmap.margin.left + heatmap.width + LEGEND.gapFromChart;
}
