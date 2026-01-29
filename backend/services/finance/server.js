const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const connectDB = require("./db");
const Company = require("./models/Company");  
const symbolSources = require("./symbol");

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());
 
connectDB();
 
let currentStocks = symbolSources.map(s => ({
  symbol: s.symbol,
  exchange: s.exchange,
  price: Math.floor(15000 + Math.random() * 65000), 
  percentChange: 0,
  refPrice: 0,
  volume: Math.floor(Math.random() * 1000000),
  lastUpdated: Date.now()
}));
currentStocks.forEach(s => s.refPrice = s.price);

function simulateMarket() {
  currentStocks = currentStocks.map(stock => {
    const fluctuation = Math.floor((Math.random() - 0.5) * 500); 
    let newPrice = stock.price + fluctuation;
    if (newPrice < 1000) newPrice = 1000;
    const percent = ((newPrice - stock.refPrice) / stock.refPrice) * 100;
    
    return {
      ...stock,
      price: newPrice,
      percentChange: parseFloat(percent.toFixed(2)),
      volume: stock.volume + Math.floor(Math.random() * 100),
      lastUpdated: Date.now()
    };
  });
}
 
app.get("/api/stock/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
     
    const company = await Company.findOne({ 
        symbol: { $regex: new RegExp(`^${symbol}$`, "i") } 
    }).lean();  

    if (!company) {
        return res.status(404).json({ message: "Không tìm thấy mã cổ phiếu" });
    }
     
    const currentPrice = currentStocks.find(s => s.symbol === company.symbol);
     
    res.json({ ...company, ...currentPrice });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi Server" });
  }
});
 
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => { 
  if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'STOCK_UPDATE', data: currentStocks }));
  }
});

setInterval(() => {
  simulateMarket();
  const msg = JSON.stringify({ type: 'STOCK_UPDATE', data: currentStocks });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}, 2000);
 
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Finance Service (MongoDB) running on port ${PORT}`);
});