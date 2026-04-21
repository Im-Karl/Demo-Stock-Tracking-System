const WebSocket = require('ws');
const { generateStockUpdate } = require('../stockService');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const url = req.url;

    if (url === '/ws/stocks') {
      console.log('Client connected to Stocks Socket');
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'STOCK_UPDATE',
            data: generateStockUpdate(),
          }),
        );
      }

      const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'STOCK_UPDATE',
              data: generateStockUpdate(),
            }),
          );
        }
      }, 60000);
      ws.on('close', () => clearInterval(interval));
    }
  });
};

module.exports = { setupWebSocket };
