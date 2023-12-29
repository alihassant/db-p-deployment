const mongoose = require("mongoose");
const { Schema } = mongoose;

const userRoles = ["viewOnly", "teamLeader", "admin", "owner"];

const databaseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    users: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: userRoles,
          default: "viewOnly",
        },
        name: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Database", databaseSchema);
