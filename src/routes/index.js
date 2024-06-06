const express = require("express");
const router = express.Router();
const pacientsList = require("../../dados/pacientes.json");
const geral = require("../Modules/geral");
const indiceCpfDate = require("../Modules/indiceCpfDate");
const dataGeral = require("../Modules/dataGeral");
const CpfIndiceRecent = require("../Modules/cpfIndiceRecent");
const CpfRecent = require("../Modules/cpfRecent");
const indiceFilter = require("../Modules/indiceFilter");


// Middleware para verificar parâmetros obrigatórios
function checkRequiredParameters(requiredParams) {
    return function(req, res, next) {
        const missingParams = requiredParams.filter(param => !req.query[param]);
        if (missingParams.length > 0) {
            return res.status(400).json({ error: `Missing required parameters: ${missingParams.join(', ')}` });
        }
        next();
    };
}

// Consultar, para cada paciente, cada uma das características individualmente e cada uma delas sendo a mais recente disponível
router.get('/cpfIndiceRecent', checkRequiredParameters(['cpf', 'typeIndice']), (req, res) => {
    const { cpf, typeIndice } = req.query;
    console.log(`Chamada de consulta cpfIndiceRecent: cpf=${cpf}, typeIndice=${typeIndice}`);
    const result = CpfIndiceRecent.createObjPersonType(cpf, typeIndice);
    return res.json(result);
});

// Consultar em uma única chamada, todas as características de um paciente, com os valores mais recentes de cada uma
router.get('/cpfRecent', checkRequiredParameters(['cpf']), (req, res) => {
    const { cpf } = req.query;
    console.log(`Chamada de consulta cpfRecent: cpf=${cpf}`);
    const result = CpfRecent.createObjPersonGeral(cpf);
    return res.json(result);
});

// Consultar para uma determinada data (dia, mês e ano), todas as características existentes de todos os pacientes da base de dados
router.get('/dataGeral', checkRequiredParameters(['date']), (req, res) => {
    const { date } = req.query;
    console.log(`Chamada de consulta dataGeral: date=${date}`);
    const dateFormat = geral.dateReformat(date);
    const result = dataGeral.createGeralDate(dateFormat);
    return res.json(result);
});

// Consultar uma característica qualquer de um paciente para um intervalo de datas a ser especificado na chamada da API
router.get('/indiceCpfDate', checkRequiredParameters(['cpf', 'typeIndice', 'dateInicial', 'dateFinal']), (req, res) => {
    const { cpf, typeIndice, dateInicial, dateFinal } = req.query;
    console.log(`Chamada de consulta indiceCpfDate: cpf=${cpf}, typeIndice=${typeIndice}, dateInicial=${dateInicial}, dateFinal=${dateFinal}`);
    const result = indiceCpfDate.cpfDatePerson(cpf, typeIndice, dateInicial, dateFinal);
    return res.json(result);
});

// Consultar o valor mais recente de uma característica de um paciente que esteja entre um intervalo de valores a ser especificado na chamada da API
router.get('/indiceFilter', checkRequiredParameters(['cpf', 'typeIndice', 'indiceInicial', 'indiceFinal']), (req, res) => {
    const { cpf, typeIndice, indiceInicial, indiceFinal } = req.query;
    console.log(`Chamada de consulta indiceFilter: cpf=${cpf}, typeIndice=${typeIndice}, indiceInicial=${indiceInicial}, indiceFinal=${indiceFinal}`);
    const find = pacientsList.find(f => f.cpf === cpf);
    if (!find) {
        return res.status(404).json({ error: "Patient not found" });
    }
    const conteudo_Filtrado = indiceFilter.indiceFilter(typeIndice, cpf, indiceInicial, indiceFinal);
    const objCpfIndice = {
        nome: find.nome,
        cpf: find.cpf,
        typeIndice,
        conteudo: conteudo_Filtrado
    };
    return res.json(objCpfIndice);
});

// Consultar pacientes que contenham um nome ou parte de um nome a ser especificado na chamada da API
router.get('/pacients', checkRequiredParameters(['nome']), (req, res) => {
    const { nome } = req.query;
    console.log(`Chamada de consulta pacients: nome=${nome}`);
    const retornoNome = pacientsList.filter((item) => item.nome && item.nome.toLowerCase().includes(nome.toLowerCase()));
    if (retornoNome.length === 0) {
        return res.status(404).json({ error: "No patients found with the specified name" });
    }
    return res.json(retornoNome);
});

module.exports = router;
