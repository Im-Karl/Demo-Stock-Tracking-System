import { useState, useEffect } from 'react';

export function useStockSocket() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => { 
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => { 
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'STOCK_UPDATE') {
          setStocks(message.data);
        }
      } catch (err) {
        console.error("Socket parse error:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return stocks;
}