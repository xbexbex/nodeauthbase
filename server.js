const express = require('express');
const app = express();
const http = require('http');

const defaultRoutes = require('./server/routes/routes.js');
defaultRoutes(app);

const apiRoutes = require('./server/routes/api_routes.js');
apiRoutes(app);

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));