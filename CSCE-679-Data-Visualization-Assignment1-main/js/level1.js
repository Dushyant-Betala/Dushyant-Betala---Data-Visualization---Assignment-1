/**
 * Level 1: Year/Month heatmap of Hong Kong's monthly max/min temperature
 * over every year in the data. Entry point for level1.html.
 */
import { LEVEL1_LAYOUT } from "./config.js";
import { renderHeatmapPage } from "./heatmapPage.js";

renderHeatmapPage({ layout: LEVEL1_LAYOUT });
