let table;
let table2;
let num = 0;
let selection;

let names = [];
let url =
  "https://www.zuerich.com/en/api/v2/data?id=1459&_ga=2.55795816.2121226043.1669980796-1030290721.1669980796";

function preload() {
  table = loadTable("data/driving_data_final.csv", "header", "csv");
  table2 = loadJSON(url, "json");
}

function setup() {
  noCanvas();

  selection = createSelect();
  selection.position(10, 10);

  //changeCSV();
  changeJSON();
  noLoop()
}

function changeCSV() {
  let rows = table.getRows();
  for (let i = 0; i < rows.length; i++) {
    let output = rows[i].getNum("gender");

    if (output == 1) {
      table.setString(i, "gender", "Female");
    } else {
      table.setString(i, "gender", "Male");
    }

    num++;
    saveTable(table, `driving_data_final_${num}.csv`);
  }
}

  function changeJSON() {
    for (var key in table2) {
      for (let i = 0; i < key; i++) {
        names.push(table2[key].name.de);
      }
    }
    let uniqueValues = getUniqueValues(names);
    console.log(names)
    for (let j = 0; j < uniqueValues.length; j++) {
      selection.option(uniqueValues[j]);
    }
}

function getUniqueValues(array) {
  let newarray = array.filter(
    (element, index, array) => array.indexOf(element) === index
  );
  return newarray;
}
