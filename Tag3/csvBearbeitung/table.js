let table;
let table2;

let fields = []

function preload() {
    table = loadTable( "data/driving_data_final.csv", "header", "csv")
    table2 = loadTable( "data/employee.csv", "header", "csv")
}

function setup() {

 noCanvas();

 let rows = table.getRows()
 for (let i = 0; i< rows.length; i++) {
        let output = rows[i].getNum("gender")
        if ( output == 1){
            table.setString(i, "gender", "Female")
        } else {
            table.setString(i, "gender", "Male")
        }
 }

 //saveTable(table, "driving_neu.csv")
 getOptions()
}

function getOptions() {
    let selection = createSelect()
    selection.position (10,10)
    let rows2 = table2.getRows()
    for (let i = 0; i< rows2.length; i++) {
        let eduField = rows2[i].getString("EducationField")
        fields.push(eduField)
    }
    let uniqueValues = getUniqueValues(fields)

    for ( let j = 0; j < uniqueValues.length; j++ ) {
        selection.option(uniqueValues[j])
    }

}

function getUniqueValues (array) {

    let newarray = array.filter((element, index, array) => array.indexOf(element) === index);
    return newarray;

}
