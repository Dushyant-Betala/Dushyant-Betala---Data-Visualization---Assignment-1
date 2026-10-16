/**
 * Loading and aggregating the Hong Kong daily temperature data.
 */
import { DATA } from "./config.js";

/**
 * One row of the CSV after parsing.
 * @typedef {object} DailyRecord
 * @property {Date}   date
 * @property {number} year
 * @property {number} month  0 = January … 11 = December
 * @property {number} day    day of the month, 1-31
 * @property {number} maxTemperature  °C
 * @property {number} minTemperature  °C
 */

/**
 * One heatmap cell: the summary of a single month of a single year.
 * @typedef {object} MonthlyRecord
 * @property {number} year
 * @property {number} month  0 = January … 11 = December
 * @property {number} maxTemperature  highest daily maximum in the month
 * @property {number} minTemperature  lowest daily minimum in the month
 * @property {DailyRecord[]} days     the month's days, sorted by day (for sparklines)
 */

const parseDate = d3.timeParse(DATA.dateFormat);

/**
 * Reads the CSV and converts every row into a DailyRecord.
 * @param {string} path  URL of the CSV file
 * @returns {Promise<DailyRecord[]>}
 */
export function loadDailyTemperatures(path) {
  const { columns } = DATA;
  return d3.csv(path, (row) => {
    const date = parseDate(row[columns.date]);
    return {
      date,
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
      maxTemperature: +row[columns.maxTemperature],
      minTemperature: +row[columns.minTemperature],
    };
  });
}

/**
 * Keeps only the rows that fall within the most recent `yearCount` years.
 * @param {DailyRecord[]} dailyRecords
 * @param {number|null} yearCount  null keeps every year
 * @returns {DailyRecord[]}
 */
export function keepLatestYears(dailyRecords, yearCount) {
  if (yearCount === null) return dailyRecords;
  const latestYear = d3.max(dailyRecords, (d) => d.year);
  return dailyRecords.filter((d) => d.year > latestYear - yearCount);
}

/**
 * Groups daily rows into one MonthlyRecord per (year, month).
 * @param {DailyRecord[]} dailyRecords
 * @returns {MonthlyRecord[]}
 */
export function aggregateByMonth(dailyRecords) {
  const summarizeMonth = (days) => ({
    maxTemperature: d3.max(days, (d) => d.maxTemperature),
    minTemperature: d3.min(days, (d) => d.minTemperature),
    days: [...days].sort((a, b) => a.day - b.day),
  });

  // flatRollup returns [year, month, summary] triples; flatten them into objects.
  return d3
    .flatRollup(dailyRecords, summarizeMonth, (d) => d.year, (d) => d.month)
    .map(([year, month, summary]) => ({ year, month, ...summary }));
}

/**
 * Lowest daily minimum and highest daily maximum across the given rows.
 * @param {DailyRecord[]} dailyRecords
 * @returns {[number, number]}
 */
export function dailyTemperatureExtent(dailyRecords) {
  return [
    d3.min(dailyRecords, (d) => d.minTemperature),
    d3.max(dailyRecords, (d) => d.maxTemperature),
  ];
}
