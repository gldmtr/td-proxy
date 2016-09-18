const net = require('net');
const config = require('./config');

function connectHandler(req, reqSocket) {
  const socket = net.connect(config.httpsPort, 'localhost', () => {
    reqSocket.write(`HTTP/${req.httpVersion} 200 OK\r\n\r\n`, 'UTF-8');
  });

  reqSocket.pipe(socket);
  socket.pipe(reqSocket);

  reqSocket.on('error', console.error);
  socket.on('error', console.error);
}

module.exports = connectHandler;

