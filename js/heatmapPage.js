/**
 * The page flow shared by both levels:
 *
 *   load CSV -> keep the configured years -> aggregate by month
 *   -> draw heatmap -> draw colour legend -> wire up the Max/Min toggle
 *
 * Level-specific additions (e.g. Level 2's sparklines) plug in through the
 * `addExtras` callback, so a new level only needs its own layout and extras.
 */
import { DATA, DEFAULT_MODE_KEY, PAGE_SELECTORS, TEMPERATURE_MODES } from "./config.js";
import { aggregateByMonth, keepLatestYears, loadDailyTemperatures } from "./data.js";
import { createTemperatureColorScale } from "./colorScale.js";
import { createTooltip } from "./tooltip.js";
import { drawHeatmap } from "./heatmap.js";
import { drawColorLegend } from "./legend.js";
import { createModeToggle, showLoadError, showYearRange } from "./controls.js";

/**
 * Builds a complete heatmap page.
 *
 * @param {object} options
 * @param {object} options.layout  LEVEL1_LAYOUT or LEVEL2_LAYOUT from config.js
 * @param {Function} [options.addExtras]  called with { heatmap, dailyRecords, legendBottom }
 *        after the heatmap and legend are drawn
 */
export async function renderHeatmapPage({ layout, addExtras = () => {} }) {
  try {
    const allDailyRecords = await loadDailyTemperatures(DATA.path);
    const dailyRecords = keepLatestYears(allDailyRecords, layout.yearsToShow);
    const monthlyRecords = aggregateByMonth(dailyRecords);
    showYearRange(PAGE_SELECTORS.yearRange, monthlyRecords);

    const colorScale = createTemperatureColorScale();
    const heatmap = drawHeatmap({
      container: PAGE_SELECTORS.chart,
      monthlyRecords,
      layout,
      colorScale,
      tooltip: createTooltip(),
      initialMode: TEMPERATURE_MODES[DEFAULT_MODE_KEY],
    });

    const legendBottom = drawColorLegend(heatmap, colorScale);
    addExtras({ heatmap, dailyRecords, legendBottom });

    // Switch between max and min with the buttons or by clicking any cell.
    const modeToggle = createModeToggle(PAGE_SELECTORS.modeToggle, heatmap.colorBy);
    heatmap.cells.on("click", modeToggle.toggle);
  } catch (error) {
    showLoadError(PAGE_SELECTORS.chart, error);
  }
}
