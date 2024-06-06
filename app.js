const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const app = express();

// Configurar CORS para permitir apenas 'https://308.serveblog.net'
const corsOptions = {
    origin: 'https://308.serveblog.net',
    optionsSuccessStatus: 200 // Para compatibilidade com alguns navegadores antigos
};
app.use(cors(corsOptions));

// Importar e usar suas rotas
const routes = require('./src/routes/index');  // Ajuste o caminho conforme necessário
app.use(routes);

// Configurar opções do servidor HTTPS
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/308.serveblog.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/308.serveblog.net/fullchain.pem')
};

// Criar o servidor HTTPS
const PORT_HTTPS = 3001; // Porta padrão para HTTPS
https.createServer(options, app).listen(PORT_HTTPS, () => {
    console.log(`API server is running on port ${PORT_HTTPS}`);
});