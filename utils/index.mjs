import fs from "fs";

export function generateCSV(
  shorts = [],
  outputFileName = "shorts",
  columnNames
) {
  const shortsWithFirstRow = [columnNames, ...shorts];

  const shortsValues = shortsWithFirstRow.map((element) =>
    Object.values(element)
  );

  let csvContent = "";
  shortsValues.forEach(function (rowArray) {
    let row = rowArray.join(";");
    csvContent += row + "\n";
  });

  fs.writeFile(`files/${outputFileName}.csv`, csvContent, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}
