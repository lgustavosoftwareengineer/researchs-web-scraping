import { generateCSV } from "../utils/index.mjs";
import { DEFAULT_COLUMN_NAMES } from "./constants/index.mjs";

export function getAllShortsByListToCSV(shorts = [], outputFileName = "") {
  const itemsFormatted = shorts.map(({ id, snippet = "" }, index) => ({
    index,
    id: id?.videoId,
    date: snippet?.publishedAt,
    title: snippet?.title.replaceAll(";", ""),
    link: `https://www.youtube.com/shorts/${id?.videoId}`,
  }));

  generateCSV(itemsFormatted, outputFileName, DEFAULT_COLUMN_NAMES);
}
