/**
 * Page controls and messages outside the chart itself.
 */
import { DATA, DEFAULT_MODE_KEY, TEMPERATURE_MODES } from "./config.js";

/**
 * Renders one button per temperature mode (Max / Min) and tracks which is active.
 *
 * @param {string} container  CSS selector of the element to hold the buttons
 * @param {Function} onChange  called with the newly selected TEMPERATURE_MODES entry
 * @returns {{ toggle: Function }} toggle() switches to the next mode, so other
 *          elements (e.g. clicking a heatmap cell) can switch modes too
 */
export function createModeToggle(container, onChange) {
  const modeKeys = Object.keys(TEMPERATURE_MODES);
  let activeKey = DEFAULT_MODE_KEY;

  const buttons = d3
    .select(container)
    .selectAll("button")
    .data(modeKeys)
    .join("button")
    .attr("type", "button")
    .attr("class", "mode-button")
    .text((key) => TEMPERATURE_MODES[key].label)
    .on("click", (_, key) => select(key));

  function highlightActiveButton() {
    buttons
      .classed("active", (key) => key === activeKey)
      .attr("aria-pressed", (key) => key === activeKey);
  }

  function select(key) {
    if (key === activeKey) return;
    activeKey = key;
    highlightActiveButton();
    onChange(TEMPERATURE_MODES[key]);
  }

  /** Cycles to the next mode (max -> min -> max ...). */
  function toggle() {
    const nextIndex = (modeKeys.indexOf(activeKey) + 1) % modeKeys.length;
    select(modeKeys[nextIndex]);
  }

  highlightActiveButton();
  return { toggle };
}

/** Writes the first–last year shown (e.g. "1997–2017") into the page heading. */
export function showYearRange(container, monthlyRecords) {
  const [firstYear, lastYear] = d3.extent(monthlyRecords, (d) => d.year);
  d3.select(container).text(`${firstYear}–${lastYear}`);
}

/** Shows a readable message in place of the chart when the data can't be loaded. */
export function showLoadError(container, error) {
  console.error(error);
  d3.select(container)
    .append("p")
    .attr("class", "error")
    .text(
      `Could not load ${DATA.path}. Browsers block local files opened directly, ` +
      "so serve this folder with a local web server (e.g. `python -m http.server`) " +
      "and open the page from http://localhost."
    );
}
