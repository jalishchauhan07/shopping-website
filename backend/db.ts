const mongoose = require("mongoose");

export {};
module.exports = mongoose.connect(process.env.DB_URL);