import { useEffect, useState } from 'react';

export const useStockSocket = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws/stocks');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'STOCK_UPDATE') {
        setStocks(message.data);
      }
    };
    return () => ws.close();
  }, []);

  return stocks;
};