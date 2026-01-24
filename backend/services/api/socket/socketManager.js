const WebSocket = require("ws");
const { generateStockUpdate } = require("../stockService"); // Nhớ copy file stockService.js vào thư mục api

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const url = req.url;

    if (url === '/ws/stocks') {
      console.log("Client connected to Stocks Socket");
      const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ 
              type: "STOCK_UPDATE", 
              data: generateStockUpdate() 
          }));
        }
      }, 2000);
      ws.on("close", () => clearInterval(interval));
    }
  });
};

module.exports = { setupWebSocket };