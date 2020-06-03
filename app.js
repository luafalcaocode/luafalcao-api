const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');

const solicitacaoServicoRoutes = require('./routes/solicitacao-servico');

const credentials = { key: fs.readFileSync('key.pem', 'utf8'), cert: fs.readFileSync('cert.pem', 'utf8') };
const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());
app.use('/api/servicos', solicitacaoServicoRoutes);


httpServer.listen(7777);
httpsServer.listen(9999);
// app.listen(4100);