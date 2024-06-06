const geral = require("./geral.js");

function filterIndicesByRangeAndCPF(type, cpf, indInicial, indFinal) {
    const fileList = geral.dirFile(`./dados/indice_${type}`);
    const filteredIndices = [];

    for (const file of fileList) {
        const indexList = geral.readF(type, file);
        const fullIndices = geral.dataObj(indexList, false);

        const filtered = fullIndices.filter(item => {
            return item.indice >= indInicial && item.indice <= indFinal && item.cpf === cpf;
        });

        if (filtered.length > 0) {
            filteredIndices.push(...filtered);
        }
    }

    return filteredIndices.sort((a, b) => a.indice - b.indice);
}

module.exports = {
    indiceFilter: filterIndicesByRangeAndCPF
};
