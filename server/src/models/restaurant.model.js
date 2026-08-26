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
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pinCode: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    geoLocation: {
      lat: {
        type: String,
        default: "",
      },

      lon: {
        type: String,
        default: "",
      },
    },

    documents: {
      legalName: {
        type: String,
        default: "",
      },

      companyType: {
        type: String,
        default: "",
      },

      gstCertificate: {
        type: String,
        default: "",
      },

      fssaiCertificate: {
        type: String,
        default: "",
      },

      panCard: {
        type: String,
        default: "",
      },
    },

    financialDetails: {
      bankName: {
        type: String,
        default: "",
      },

      accountNumber: {
        type: String,
        default: "",
      },

      ifscCode: {
        type: String,
        default: "",
      },
    },

    contactDetails: {
      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },
    },

    servingHours: {
      openingTime: {
        type: String,
        default: "09:00",
      },

      closingTime: {
        type: String,
        default: "22:00",
      },
    },

    isOpen: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    cuisineTypes: [
      {
        type: String,
      },
    ],

    restaurantImage: [
      {
        url: {
          type: String,
          default: "",
        },

        publicId: {
          type: String,
          default: "",
        },
      },
    ],

    coverImage: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    description: {
      type: String,
      default: "",
    },

    restaurantType: {
      type: String,
      enum: ["veg", "non-veg", "jain", "vegan", "both"],
      default: "both",
    },

    socialMediaLinks: [
      {
        platform: {
          type: String,
          default: "",
        },

        url: {
          type: String,
          default: "",
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
