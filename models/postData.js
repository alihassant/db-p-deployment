const mongoose = require("mongoose");
const { Schema } = mongoose;

const postDataSchema = new Schema(
  {
    carName: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    carPurchasePrice: {
      type: String,
      required: true,
    },
    carSellPrice: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dbId: {
      type: Schema.Types.ObjectId,
      ref: "Database",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postDataSchema);
