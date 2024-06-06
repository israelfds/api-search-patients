const CpfIndiceRecent = require("./cpfIndiceRecent.js");
const geral = require("./geral.js");
const pacientsList = require("../../dados/pacientes.json");

function removeCpfProperty(obj) {
    const { cpf, ...newObj } = obj;
    return newObj;
}

function translateDate(date) {
    return geral.translateEpoch(date);
}

function createTypeIndiceObj(resp, type) {
    const { date, ...rest } = resp;
    return {
        [type]: {
            ...removeCpfProperty(rest),
            date: translateDate(date)
        }
    };
}

function createObjPersonGeral(cpf) {
    const find = pacientsList.find(paciente => paciente.cpf === cpf);
    if (!find) {
        throw new Error(`Patient with CPF ${cpf} not found`);
    }

    const resp1 = CpfIndiceRecent.searchArchiveCpfIndiceRecent(cpf, "cardiaco");
    const resp2 = CpfIndiceRecent.searchArchiveCpfIndiceRecent(cpf, "pulmonar");

    const newObj = {
        nome: find.nome,
        idade: find.idade,
        cpf: find.cpf,
        ...createTypeIndiceObj(resp1, "typeIndiceCardiaco"),
        ...createTypeIndiceObj(resp2, "typeIndicePulmonar")
    };

    return newObj;
}

module.exports = {
    createObjPersonGeral
};
