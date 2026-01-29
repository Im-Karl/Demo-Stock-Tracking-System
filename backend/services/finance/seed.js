const mongoose = require("mongoose");
const connectDB = require("./db");
const Company = require("./models/Company");
const symbolSources = require("./symbol");  

const seedData = async () => {
  await connectDB();

  try { 
    await Company.deleteMany({});
    console.log("Đã xóa dữ liệu cũ.");
 
    const companies = symbolSources.map(bank => ({
      symbol: bank.symbol,
      organ_name_vi: bank.organ_name_vi,
      organ_name_en: bank.organ_name_en,
      introduce: bank.introduce,  
      hotline: bank.hotlines,  
      url: bank.url,
      exchange: bank.exchange,
      status: "listed"
    }));

    await Company.insertMany(companies);
    console.log(`Đã nạp thành công ${companies.length} công ty vào MongoDB!`);
  } catch (err) {
    console.error("Lỗi seed data:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedData();