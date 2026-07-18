import mongoose from "mongoose";

const RestaurantSchema = mongoose.Schema(
  {
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    restaurantName: {
      type: String,
      required: true,
    },

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

    geoLocation: {
      lat: {
        type: String,
      },

      lon: {
        type: String,
      },
    },

    documents: {
      legalName: {
        type: String,
        required: true,
      },

      companyType: {
        type: String,
        required: true,
      },

      gstCertificate: {
        type: String,
        required: true,
      },

      fssaiCertificate: {
        type: String,
        required: true,
      },

      panCard: {
        type: String,
        required: true,
      },
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

    contactDetails: {
      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    servingHours: {
      openingTime: {
        type: String,
        required: true,
      },

      closingTime: {
        type: String,
        required: true,
      },
    },

    isOpen: {
      type: Boolean,
      default: false,
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

    cuisineTypes: [
      {
        type: String,
        required: true,
      },
    ],

    restaurantImage: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    coverImage: {
      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },

    description: {
      type: String,
      required: true,
    },

    restaurantType: {
      type: String,
      enum: ["veg", "non-veg", "jain", "vegan", "both"],
      required: true,
    },

    socialMediaLinks: [
      {
        platform: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Restaurant = mongoose.model("restaurant", RestaurantSchema);

export default Restaurant;
