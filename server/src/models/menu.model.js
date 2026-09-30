import mongoose from "mongoose";

const MenuItemSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    foodType: {
      type: String,
      default: "Vegetarian",
    },

    image: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["available", "unavailable", "discontinued"],
      default: "available",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isTopRated: {
      type: Boolean,
      default: false,
    },

    isRecommended: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    customizationOptions: {
      isCustomizable: {
        type: Boolean,
        default: false,
      },
      sizes: [
        {
          name: { type: String, default: "" },
          priceExtra: { type: Number, default: 0 },
        },
      ],
      crustsOrBases: [
        {
          name: { type: String, default: "" },
          priceExtra: { type: Number, default: 0 },
        },
      ],
      spiceLevels: [{ type: String }],
      addOns: [
        {
          name: { type: String, default: "" },
          price: { type: Number, default: 0 },
        },
      ],
      saucesOrDips: [
        {
          name: { type: String, default: "" },
          price: { type: Number, default: 0 },
        },
      ],
    },
  },
  {
    suppressReservedKeysWarning: true,
  }
);

const MenuSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },

    menuItems: [MenuItemSchema],
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

const Menu = mongoose.model("menu", MenuSchema);

export default Menu;