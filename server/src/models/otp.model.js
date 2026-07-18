import mongoose from "mongoose";


const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 60 * 1000,
    },
  },
  {
    timestamps: true,
  }
);


const OTP = mongoose.model("otp", otpSchema);

export default OTP;