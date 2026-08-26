import Customer from "../models/customer.model.js";
import Menu from "../models/menu.model.js";
import Order from "../models/order.model.js";

const getDefaultDeliveryAddress = (currentUser, defaultAddr) => {
  if (defaultAddr) {
    return {
      name: defaultAddr.name || currentUser.fullname || currentUser.fullName || "Customer",
      address: defaultAddr.address || "Main Street",
      city: defaultAddr.city || "City",
      state: defaultAddr.state || "State",
      pinCode: defaultAddr.pinCode || defaultAddr.pincode || "000000",
      country: defaultAddr.country || "India",
      geoLocation: {
        lat: defaultAddr.geoLocation?.lat || "",
        lon: defaultAddr.geoLocation?.lon || "",
      },
    };
  }

  return {
    name: currentUser.fullname || currentUser.fullName || "Customer",
    address: currentUser.address || "Main Street",
    city: currentUser.city || "City",
    state: currentUser.state || "State",
    pinCode: currentUser.pincode || currentUser.pinCode || "000000",
    country: "India",
    geoLocation: {
      lat: "",
      lon: "",
    },
  };
};

export const CreateOrder = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (
      !currentUser ||
      (currentUser.userType !== "user" && currentUser.userType !== "customer")
    ) {
      const error = new Error("Only customers can create orders");
      error.statusCode = 403;
      return next(error);
    }

    const { restaurantId, orderItems, paymentMethod, deliveryAddress } =
      req.body;

    if (
      !restaurantId ||
      !Array.isArray(orderItems) ||
      orderItems.length === 0
    ) {
      const error = new Error("restaurantId and orderItems are required");
      error.statusCode = 400;
      return next(error);
    }

    let customer = await Customer.findOne({ customerId: currentUser._id });
    if (!customer) {
      customer = await Customer.create({
        customerId: currentUser._id,
        addressBook: [],
      });
    }

    const defaultAddr = customer.addressBook?.find((a) => a.isDefault) || customer.addressBook?.[0];

    const menuDoc = await Menu.findOne({ restaurantId });
    if (!menuDoc || !menuDoc.menuItems?.length) {
      const error = new Error("Restaurant menu not found");
      error.statusCode = 404;
      return next(error);
    }

    const normalizedOrderItems = [];
    let itemsAmount = 0;

    for (const item of orderItems) {
      const menuItem = menuDoc.menuItems.id(item.itemId);
      const qty = Number(item.quantity);

      if (!menuItem || !qty || qty < 1) {
        const error = new Error("Invalid order item or quantity");
        error.statusCode = 400;
        return next(error);
      }

      itemsAmount += Number(menuItem.price) * qty;
      normalizedOrderItems.push({
        itemId: menuItem._id,
        quantity: qty,
      });
    }

    const platformFee = 5;
    const convenienceFee = 5;
    const deliveryCharge = 0;
    const taxAmount = Math.round(itemsAmount * 0.05 * 100) / 100;
    const discountAmount = 0;
    const totalAmount = Math.round(itemsAmount * 100) / 100;
    const finalAmount =
      Math.round(
        (totalAmount +
          platformFee +
          convenienceFee +
          deliveryCharge +
          taxAmount -
          discountAmount) *
          100
      ) / 100;

    const newOrder = await Order.create({
      restaurantId,
      customerId: customer._id,
      orderItems: normalizedOrderItems,
      orderStatus: "pending",
      billDetails: {
        totalAmount,
        platformFee,
        convenienceFee,
        taxAmount,
        deliveryCharge,
        discountAmount,
        finalAmount,
      },
      deliveryAddress:
        deliveryAddress || getDefaultDeliveryAddress(currentUser, defaultAddr),
      paymentDetails: {
        paymentMethod: paymentMethod || "upi",
        paymentStatus: "pending",
      },
    });

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};