const geral = require("./geral.js");
const pacientsList = require("../../dados/pacientes.json");

function getMostRecentDate(objPessoas) {
    const dates = objPessoas.map(pessoa => pessoa.date);
    return geral.dataRecent(dates);
}

function searchCpfDateIndiceRecent(objPessoas, dateRecent) {
    if (!objPessoas || !dateRecent) {
        throw new Error("Invalid input: objPessoas or dateRecent is undefined");
    }

    const result = objPessoas.find(obj => obj.date == dateRecent);
    if (!result) {
        throw new Error("Date not found in objPessoas");
    }
    return result;
}

function searchArchiveCpfIndiceRecent(cpf, typeIndice) {
    const recent = indiceRecente(typeIndice);
    const list = geral.searchCpf(cpf, typeIndice, recent);
    const objPessoas = geral.dataObj(list);
    const dateRecent = getMostRecentDate(objPessoas);
    return searchCpfDateIndiceRecent(objPessoas, dateRecent);
}

function indiceRecente(typeIndice) {
    const listNameFile = geral.dirFile(`./dados/indice_${typeIndice}`);
    const objDates = geral.percorrerAndModify(listNameFile);
    return geral.dataDirRecent(objDates);
}

function createObjPersonType(cpf, typeIndice) {
    try {
        const resp = searchArchiveCpfIndiceRecent(cpf, typeIndice);
        const find = pacientsList.find(f => f.cpf === cpf);

        return {
            nome: find.nome,
            idade: find.idade,
            cpf: find.cpf,
            tipoIndice: typeIndice,
            dataIndice: geral.translateEpoch(resp.date),
            numeberIndice: resp.indice
        };
    } catch (error) {
        console.error("Error creating objPessoaType:", error.message);
        return null;
    }
}

module.exports = {
    searchArchiveCpfIndiceRecent,
    createObjPersonType
};
