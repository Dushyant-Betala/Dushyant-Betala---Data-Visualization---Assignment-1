/**
 * Level 2: the Level 1 heatmap for the most recent years, with a mini line
 * chart of the daily max and min temperature inside every cell.
 * Entry point for level2.html.
 */
import { LEGEND, LEVEL2_LAYOUT } from "./config.js";
import { dailyTemperatureExtent } from "./data.js";
import { renderHeatmapPage } from "./heatmapPage.js";
import { drawSparklines } from "./sparkline.js";
import { drawSparklineKey } from "./legend.js";

/** Adds the daily max/min line charts and their colour key to the finished heatmap. */
function addDailySparklines({ heatmap, dailyRecords, legendBottom }) {
  drawSparklines(heatmap.cells, {
    cellWidth: heatmap.xScale.bandwidth(),
    cellHeight: heatmap.yScale.bandwidth(),
    temperatureExtent: dailyTemperatureExtent(dailyRecords),
  });

  drawSparklineKey(heatmap, legendBottom + LEGEND.sparklineKey.gapAbove);
}

renderHeatmapPage({ layout: LEVEL2_LAYOUT, addExtras: addDailySparklines });
