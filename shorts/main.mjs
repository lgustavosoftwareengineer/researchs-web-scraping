import { ALL_FOLHA_SHORTS, ALL_G1_SHORTS } from "./data/index.mjs";

import { getAllShortsByListToCSV } from "./getAllShortsByListToCSV.mjs";

async function main() {
  // // Get manually all shorts and add to array
  getAllShortsByListToCSV(ALL_G1_SHORTS, "g1-shorts");
  getAllShortsByListToCSV(ALL_FOLHA_SHORTS, "folha-shorts");
}

main();
