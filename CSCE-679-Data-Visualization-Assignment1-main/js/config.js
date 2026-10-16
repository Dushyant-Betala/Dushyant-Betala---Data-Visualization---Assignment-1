/**
 * Central configuration shared by both levels.
 *
 * Every tunable value (data source, sizes, colours, spacing, labels) lives here,
 * so the visualizations can be restyled or pointed at new data without touching
 * the drawing code.
 */

/* ------------------------------------------------------------------ */
/* Data source                                                         */
/* ------------------------------------------------------------------ */

export const DATA = {
  path: "temperature_daily.csv",
  dateFormat: "%Y-%m-%d",
  // CSV column names, mapped to the field names used throughout the code.
  columns: {
    date: "date",
    maxTemperature: "max_temperature",
    minTemperature: "min_temperature",
  },
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ------------------------------------------------------------------ */
/* What the cell colour encodes                                        */
/* ------------------------------------------------------------------ */

/**
 * The monthly statistics a cell can be coloured by.
 * The object keys are also the states of the Max/Min toggle; add an entry here
 * (e.g. a monthly mean) and a new toggle button appears automatically.
 */
export const TEMPERATURE_MODES = {
  max: { label: "Max temperature", valueOf: (record) => record.maxTemperature },
  min: { label: "Min temperature", valueOf: (record) => record.minTemperature },
};
export const DEFAULT_MODE_KEY = "max";

export const COLOR = {
  // Celsius range split into 11 equal-width bins, one per palette colour.
  // [0, 39] reproduces every cell colour of the reference screenshots.
  domain: [0, 39],
  // Spectral palette reversed so that cold = purple/blue and hot = dark red.
  palette: [...d3.schemeSpectral[11]].reverse(),
  // The first and last bins are open-ended (values outside the domain are clamped
  // into them), so the legend's end labels use the reference's 0–40 °C range.
  legendLabelRange: [0, 40],
  // Duration of the recolouring animation when switching Max/Min.
  transitionMs: 400,
};

/* ------------------------------------------------------------------ */
/* Layout of each level                                                */
/* ------------------------------------------------------------------ */

export const LEVEL1_LAYOUT = {
  yearsToShow: null,      // null = every year in the data
  cellWidth: 40,          // horizontal space per year, including the gap
  cellHeight: 37,         // vertical space per month, including the gap
  cellPadding: 0.2,       // fraction of that space left empty between cells
  margin: { top: 30, right: 120, bottom: 10, left: 80 },
};

export const LEVEL2_LAYOUT = {
  yearsToShow: 10,        // only the most recent N years are drawn
  cellWidth: 96,
  cellHeight: 72,
  cellPadding: 0.2,
  margin: { top: 30, right: 140, bottom: 10, left: 80 },
};

export const SPARKLINE = {
  inset: 3,               // px between the cell border and the lines
  daysInLongestMonth: 31, // fixed x-domain, so shorter months end early
  maxLineColor: "#31a354",
  minLineColor: "#9ecae1",
};

/* ------------------------------------------------------------------ */
/* Legend, tooltip and page elements                                   */
/* ------------------------------------------------------------------ */

export const LEGEND = {
  swatchWidth: 18,
  swatchHeight: 22,
  gapFromChart: 20,       // px between the last column and the legend
  labelGap: 4,            // px between a swatch and its text label
  unit: "Celsius",
  rangeDecimals: 1,       // decimals in the swatch hover text, e.g. "3.5 – 7.1 °C"
  sparklineKey: {
    gapAbove: 40,         // px between the colour legend and the line key
    rowHeight: 18,
    lineLength: 20,
    lineWidth: 2,
    labelGap: 6,
  },
};

export const TOOLTIP = {
  pointerOffset: 12,      // px between the mouse pointer and the tooltip box
};

/** CSS selectors of the page elements the scripts fill in. */
export const PAGE_SELECTORS = {
  chart: "#chart",
  modeToggle: "#mode-toggle",
  yearRange: "#year-range",
};
