import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
      },
    },
    userType: {
      type: String,
      enum: ["admin", "user", "rider", "restaurant"],
      required: true,
      default: "user",
    },
    lastPasswordChange: {
      type: Date,
      default: null,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    pincode: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", UserSchema);

export default User;