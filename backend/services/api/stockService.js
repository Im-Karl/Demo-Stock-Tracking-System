const bankingStocks = [
  "NVB",
  "BAB",
  "SHB",
  "STB",
  "VPB",
  "MBB",
  "TCB",
  "TPB",
  "CTG",
  "ACB",
  "LPB",
  "MSB",
  "HDB",
  "EIB",
  "VIB",
  "OCB",
  "BID",
  "VCB",
  "SSB",
  "NAB",
  "VAB",
  "ABB",
  "BVB",
  "KLB",
  "PGB",
  "SGB",
  "VBB"
];

// Hàm sinh biến động giá giả tưởng
function generateStockUpdate() {
  return bankingStocks.map(symbol => {
    const change = (Math.random() - 0.5) * 1000; // Biến động ngẫu nhiên
    const price = 50000 + Math.random() * 50000; // Giá giả định
    return {
      symbol,
      price: parseFloat(price.toFixed(0)),
      change: parseFloat(change.toFixed(2)),
      percentChange: parseFloat((change / price * 100).toFixed(2)),
      timestamp: new Date().toISOString()
    };
  });
}

module.exports = { generateStockUpdate };