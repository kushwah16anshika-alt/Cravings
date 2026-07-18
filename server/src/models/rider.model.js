import mongoose from "mongoose";

const RiderSchema = mongoose.Schema(
  {
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    vehicleDetails: {
      vehicleType: {
        type: String,
        required: true,
      },

      vehicleNumber: {
        type: String,
        required: true,
      },

      vehicleModel: {
        type: String,
        required: true,
      },

      vehicleColor: {
        type: String,
        required: true,
      },
    },

    documents: {
      drivingLicense: {
        type: String,
        required: true,
      },

      vehicleRegistrationCertificate: {
        type: String,
        required: true,
      },

      insuranceCertificate: {
        type: String,
        required: true,
      },

      aadharCard: {
        type: String,
        required: true,
      },

      panCard: {
        type: String,
        required: true,
      },
    },

    currentAddress: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pinCode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    isAvailable: {
      type: Boolean,
      default: false,
    },

    financialDetails: {
      bankName: {
        type: String,
        required: true,
      },

      accountNumber: {
        type: String,
        required: true,
      },

      ifscCode: {
        type: String,
        required: true,
      },
    },

    currentLocation: {
      lat: {
        type: String,
      },

      lon: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Rider = mongoose.model("rider", RiderSchema);

export default Rider;
