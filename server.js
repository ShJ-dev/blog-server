const http = require('http');
const app = require('./App');

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT);
