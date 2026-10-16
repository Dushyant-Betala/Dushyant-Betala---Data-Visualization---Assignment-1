import { COLOR } from "./config.js";

/**
 * Maps a temperature in Celsius to one of the discrete palette colours.
 * The domain is split into equal-width bins, one per colour.
 */
export function createTemperatureColorScale() {
  return d3.scaleQuantize().domain(COLOR.domain).range(COLOR.palette);
}
