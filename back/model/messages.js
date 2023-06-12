const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      text: String,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    thumbsUpCount: { type: Number, default: 0 },
    thumbsDownCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);
