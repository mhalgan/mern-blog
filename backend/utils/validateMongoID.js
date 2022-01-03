const mongoose = require("mongoose");

const validateMongoID = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("The provided ID is not valid");
};

module.exports = validateMongoID;
