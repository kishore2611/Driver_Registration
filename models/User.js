const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
        "Please enter a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    address:[
        {
            latitude:{type: String, default: null},
            longitude:{type: String, default: null}
        }
    ],
    role: {
      type: String,
      default: "User",
    },
    verificationCode: {
      type: Number,
      default: null,
    },
    isVerified: {
      type: Number,
      default: 1,
    },
    isBlocked: {
      type: Number,
      default: 0,
    },
    userToken: {
      type: String,
      default: null,
    },
    userSocialToken: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    userSocialType: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    userDeviceToken: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    userDeviceType: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
