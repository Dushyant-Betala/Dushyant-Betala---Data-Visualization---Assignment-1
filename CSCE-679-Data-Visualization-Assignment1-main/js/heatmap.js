/**
 * The year × month matrix shared by both levels.
 */
import { COLOR, MONTH_NAMES } from "./config.js";
import { formatMonthTooltip } from "./tooltip.js";

/**
 * Draws the matrix: years along the x-axis, months along the y-axis.
 *
 * Each cell is a <g> holding a coloured background <rect>, so that callers can
 * add extra marks to the same cell (Level 2 adds sparklines).
 *
 * @param {object} options
 * @param {string} options.container  CSS selector of the element to draw into
 * @param {import("./data.js").MonthlyRecord[]} options.monthlyRecords  one record per cell
 * @param {object} options.layout  LEVEL1_LAYOUT or LEVEL2_LAYOUT from config.js
 * @param {Function} options.colorScale  temperature -> colour
 * @param {object} options.tooltip  object returned by createTooltip()
 * @param {object} options.initialMode  entry of TEMPERATURE_MODES used for the first paint
 * @returns handles the caller needs: svg, cells, scales, inner size, margin and colorBy()
 */
export function drawHeatmap({ container, monthlyRecords, layout, colorScale, tooltip, initialMode }) {
  const { cellWidth, cellHeight, cellPadding, margin } = layout;

  const years = [...new Set(monthlyRecords.map((d) => d.year))].sort(d3.ascending);
  const monthIndexes = d3.range(MONTH_NAMES.length);
  const width = years.length * cellWidth;
  const height = monthIndexes.length * cellHeight;

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // All matrix content is drawn inside the margins.
  const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleBand().domain(years).range([0, width]).padding(cellPadding);
  const yScale = d3.scaleBand().domain(monthIndexes).range([0, height]).padding(cellPadding);

  drawAxes(chart, xScale, yScale);

  const cells = chart
    .append("g")
    .attr("class", "cells")
    .selectAll("g")
    .data(monthlyRecords)
    .join("g")
    .attr("class", "cell")
    .attr("transform", (d) => `translate(${xScale(d.year)},${yScale(d.month)})`);

  cells
    .append("rect")
    .attr("class", "cell-background")
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(initialMode.valueOf(d)));

  // pointerenter/leave (unlike mouseover/out) don't re-fire when the pointer
  // moves between a cell's children (background rect and sparklines).
  cells
    .on("pointerenter", (event, d) => tooltip.show(event, formatMonthTooltip(d)))
    .on("pointermove", (event) => tooltip.move(event))
    .on("pointerleave", () => tooltip.hide());

  /** Recolours every cell by the given temperature mode (an entry of TEMPERATURE_MODES). */
  function colorBy(mode) {
    cells
      .select(".cell-background")
      .transition()
      .duration(COLOR.transitionMs)
      .attr("fill", (d) => colorScale(mode.valueOf(d)));
  }

  return { svg, cells, xScale, yScale, width, height, margin, colorBy };
}

/** Years along the top edge, month names along the left edge. */
function drawAxes(chart, xScale, yScale) {
  chart
    .append("g")
    .attr("class", "axis axis--years")
    .call(d3.axisTop(xScale));

  chart
    .append("g")
    .attr("class", "axis axis--months")
    .call(d3.axisLeft(yScale).tickFormat((monthIndex) => MONTH_NAMES[monthIndex]));
}
