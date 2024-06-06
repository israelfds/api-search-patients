const geral = require("./geral.js");
const pacientsList = require("../../dados/pacientes.json");

function convertDate(DataDDMMYY) {
    const [day, month, year] = DataDDMMYY.split("/").map(Number);
    return new Date(year, month - 1, day);
}

function filterDatesByInterval(dateInicial, dateFinal, listaDate) {
    const dataInicial = convertDate(dateInicial);
    const dataFinal = convertDate(dateFinal);
    return listaDate.filter(result => {
        const currentDate = convertDate(result);
        return currentDate >= dataInicial && currentDate <= dataFinal;
    });
}

function getListOfRecentDates(typeIndice) {
    const listNameFile = geral.dirFile(`./dados/indice_${typeIndice}`);
    const objDates = geral.percorrerAndModify(listNameFile);
    return objDates.listDateFormat.sort((a, b) => new Date(b) - new Date(a));
}

function cpfDatePerson(cpf, typeIndice, dateInicial, dateFinal) {
    const listaDate = getListOfRecentDates(typeIndice);
    const filteredDates = filterDatesByInterval(dateInicial, dateFinal, listaDate);
    const patient = pacientsList.find(patient => patient.cpf === cpf);

    const objMaster = {
        nome: patient.nome,
        cpf: patient.cpf,
        type: typeIndice,
        conteudo: []
    };

    for (const date of filteredDates) {
        const searchData = geral.searchCpf(patient.cpf, typeIndice, geral.dateReformat(date));
        const dataObj = geral.dataObj(searchData, true);
        objMaster.conteudo.push(dataObj);
    }

    return objMaster;
}

module.exports = {
    cpfDatePerson
};
