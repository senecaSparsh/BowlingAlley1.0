/*const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    fullName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    bowlingAlley: { type: BowlingAlley.schema, default: {} },
    previousGames: [Game.schema],
    gameHistory: [Game.schema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("profilePicturePath").get(function () {
  if (this.profilePicture) {
    return `/uploads/${this.profilePicture}`;
  }
  return "";
});

module.exports = mongoose.model("User", UserSchema);*/

//===============Sprint 2=================

const mongoose = require("mongoose");
const GameSchema = require("./game.model").schema; // Import GameSchema for embedding

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    fullName: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    bowlingAlley: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BowlingAlley",
    },
    previousGames: [GameSchema],
    gameHistory: [GameSchema],
    preferredLane: { type: String, default: "" },
    preferredBall: { type: String, default: "" },
    preferredShoeSize: { type: String, default: "" },
    paymentMethods: [{ type: String }],
    paymentHistory: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("profilePicturePath").get(function () {
  if (this.profilePicture) {
    return `${this.profilePicture}`;
  }
  return "";
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
