const fs = require("fs");

function readF(typeIndice, date) {
    const dataPath = `./dados/indice_${typeIndice}/${date}`;
    const buffer = fs.readFileSync(dataPath);
    const content = buffer.toString();
    return content.split(/\r?\n/);
}

function dataRecent(datapessoalist){
    let lista = [];
    for(i = 0 ; i < datapessoalist.length ; i++ ){
        let time = datapessoalist[i];
        lista.push(time);
    }
    return Math.max(...lista);
}

function searchCpf(numberCPF, typeIndice, dateIndice) {
    const list = readF(typeIndice, dateIndice);
    return list.filter(cpf => cpf.includes(numberCPF));
}

function translateEpoch(dateEpoch) {
    const myDate = new Date(dateEpoch * 1000);
    return myDate.toLocaleString();
}

function dirFile(dir) {
    return fs.readdirSync(dir);
}

function modifyArchiveDate(dataString) {
    return dataString.slice(0, 2) + "/" + dataString.slice(2, 4) + "/" + dataString.slice(4);
}

function percorrerAndModify(list) {
    const listDateFormat = list.map(modifyArchiveDate);
    const mapObj = list.reduce((obj, date) => {
        obj[modifyArchiveDate(date)] = date;
        return obj;
    }, {});
    return { listDateFormat, mapObj };
}

function dataDirRecent(objDates) {
    const sortedDates = objDates.listDateFormat.sort((a, b) => new Date(b) - new Date(a));
    return objDates.mapObj[sortedDates[0]];
}

function dataObj(lista, flagFormat) {
    const listReturn = [];

    for (let i = 1; i < lista.length; i++) {
        const arraySplit = lista[i].split(" ");
        const obj = {
            cpf: arraySplit[0],
            date: flagFormat ? translateEpoch(arraySplit[1]) : arraySplit[1],
            indice: arraySplit[2]
        };
        listReturn.push(obj);
    }

    return listReturn;
}

function dateReformat(date) {
    return date.replace("/", "").replace("/", "");
}

module.exports = {
    readF,
    dataRecent,
    searchCpf,
    translateEpoch,
    dirFile,
    percorrerAndModify,
    dataDirRecent,
    dataObj,
    dateReformat
};
