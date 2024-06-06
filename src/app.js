const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS para permitir apenas 'http://localhost:3000'
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // Para compatibilidade com alguns navegadores antigos
};
app.use(cors(corsOptions));

// Importar e usar suas rotas
const routes = require('./routes');  // Ajuste o caminho conforme necessário
app.use(routes);

// Outros middlewares e configurações
// ...

// Iniciar o servidor na porta 3001
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
