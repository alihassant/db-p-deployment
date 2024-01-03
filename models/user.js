const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    defaultRole: {
      type: String,
      required: true,
      default: "user",
    },
    extraRole: {
      type: String,
      required: true,
      default: "user",
      emun: ["user", "teamLeader", "admin", "superAdmin"],
    },
    entries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    databases: [
      {
        dbId: {
          type: Schema.Types.ObjectId,
          ref: "Database",
        },
        dbRole: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
