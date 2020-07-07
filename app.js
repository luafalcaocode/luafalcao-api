const express = require('express');
const app = express();
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const config = require('./config/config');
const servicesRoutes = require('./routes/servicesRoute');
const notFoundController = require('./controllers/404Controller');

const credentials = { key: fs.readFileSync('key.pem', 'utf8'), cert: fs.readFileSync('cert.pem', 'utf8') };

app.use(express.static(config.publicFolder)); 
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(cors());

app.use('/api/servicos', servicesRoutes);
app.use('/', notFoundController.notFound);

app.listen(5523);
https.createServer(credentials, app).listen(3333);
