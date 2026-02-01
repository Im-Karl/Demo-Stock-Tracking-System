const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true },
  organ_name_vi: { type: String },
  organ_name_en: { type: String },
  introduce: { type: String },
  url: { type: String }, 
  facebookUrl: { type: String },
  hotline: [{ type: String }],  
  exchange: {
    type: String,
    enum: ["HOSE", "HNX", "UPCOM"],
  },

  youtubeChannelId: { type: String }, 
  latestVideoId: { type: String },
 
  status: {
    type: String,
    enum: ["listed", "suspended", "delisted"],
    default: "listed",
  }
});

module.exports = mongoose.model("Company", CompanySchema);
