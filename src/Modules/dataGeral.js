const pacientsList = require("../../dados/pacientes.json");
const geral = require("./geral");

function getCardiacIndices(cpf, date) {
    const dataCardiacList = geral.searchCpf(cpf, "cardiaco", date);
    return geral.dataObj(dataCardiacList, true);
}

function getPulmonaryIndices(cpf, date) {
    const dataPulmonaryList = geral.searchCpf(cpf, "pulmonar", date);
    return geral.dataObj(dataPulmonaryList, true);
}

function createGeneralDataByDate(date) {
    const generalList = [];

    for (const patient of pacientsList) {
        const { cpf, nome } = patient;
        const cardiacIndices = getCardiacIndices(cpf, date);
        const pulmonaryIndices = getPulmonaryIndices(cpf, date);

        const patientData = {
            nome,
            cpf,
            typeIndice: {
                cardiaco: cardiacIndices,
                pulmonar: pulmonaryIndices,
            },
        };

        generalList.push(patientData);
    }

    return generalList;
}

module.exports = {
    createGeralDate: createGeneralDataByDate,
};
