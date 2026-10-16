/**
 * A single floating tooltip that follows the mouse pointer.
 */
import { TOOLTIP } from "./config.js";

/**
 * Creates the tooltip element (hidden until show() is called).
 * @returns {{ show: Function, move: Function, hide: Function }}
 */
export function createTooltip() {
  const tooltip = d3.select("body").append("div").attr("class", "tooltip");
  const { pointerOffset } = TOOLTIP;

  /** Places the tooltip next to the pointer, flipping to the left near the window's right edge. */
  function move(event) {
    const tooltipWidth = tooltip.node().getBoundingClientRect().width;
    const fitsOnRight = event.clientX + pointerOffset + tooltipWidth <= window.innerWidth;
    const left = fitsOnRight
      ? event.pageX + pointerOffset
      : event.pageX - pointerOffset - tooltipWidth;

    tooltip
      .style("left", `${left}px`)
      .style("top", `${event.pageY + pointerOffset}px`);
  }

  /** Shows `text` in the tooltip at the pointer position of `event`. */
  function show(event, text) {
    tooltip.text(text).classed("visible", true);
    move(event);
  }

  function hide() {
    tooltip.classed("visible", false);
  }

  return { show, move, hide };
}

/**
 * Tooltip text for one month, in the reference format,
 * e.g. "Date: 2002-03; max: 28 min: 14".
 * @param {import("./data.js").MonthlyRecord} record
 */
export function formatMonthTooltip(record) {
  const monthNumber = String(record.month + 1).padStart(2, "0");
  return `Date: ${record.year}-${monthNumber}; max: ${record.maxTemperature} min: ${record.minTemperature}`;
}
