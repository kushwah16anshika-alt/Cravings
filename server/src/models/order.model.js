import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },

    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rider",
      required: false,
    },

    orderItems: {
      type: [
        {
          itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          itemName: {
            type: String,
            default: "",
          },
          price: {
            type: Number,
            default: 0,
          },
          quantity: {
            type: Number,
            required: true,
          },
          customization: {
            isCustomized: {
              type: Boolean,
              default: false,
            },
            size: {
              type: String,
              default: "",
            },
            sizeExtra: {
              type: Number,
              default: 0,
            },
            baseOrCrust: {
              type: String,
              default: "",
            },
            baseExtra: {
              type: Number,
              default: 0,
            },
            spiceLevel: {
              type: String,
              default: "",
            },
            selectedAddOns: [
              {
                name: { type: String },
                price: { type: Number, default: 0 },
              },
            ],
            selectedSauces: [
              {
                name: { type: String },
                price: { type: Number, default: 0 },
              },
            ],
            specialInstructions: {
              type: String,
              default: "",
            },
            customizationPrice: {
              type: Number,
              default: 0,
            },
          },
        },
      ],
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "preparing",
        "ready",
        "pickedUp",
        "onTheWay",
        "outForDelivery",
        "undeliverable",
        "delivered",
        "cancelled",
        "failed",
        "rejected",
      ],
      default: "pending",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    billDetails: {
      type: {
        totalAmount: {
          type: Number,
          required: true,
        },
        platformFee: {
          type: Number,
          required: true,
        },
        convenienceFee: {
          type: Number,
          required: true,
        },
        taxAmount: {
          type: Number,
          required: true,
        },
        deliveryCharge: {
          type: Number,
          required: true,
        },
        discountAmount: {
          type: Number,
          required: true,
        },
        finalAmount: {
          type: Number,
          required: true,
        },
      },
    },

    deliveryAddress: {
      type: {
        name: {
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
          type: {
            lat: {
              type: String,
            },
            lon: {
              type: String,
            },
          },
        },
      },
    },

    paymentDetails: {
      type: {
        paymentMethod: {
          type: String,
          enum: ["card", "upi"],
          required: true,
        },

        paymentStatus: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },

        razorpayOrderId: {
          type: String,
        },

        razorpayPaymentId: {
          type: String,
        },

        razorpaySignature: {
          type: String,
        },

        paidAt: {
          type: Date,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", OrderSchema);

export default Order;