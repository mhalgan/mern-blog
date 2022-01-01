const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB is connected successfully");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

module.exports = dbConnect;
