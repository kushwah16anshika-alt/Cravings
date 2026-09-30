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
      let menuItem = menuDoc.menuItems.id(item.itemId);
      
      // Fallback for custom meal studio dishes if matched by first active item
      if (!menuItem && menuDoc.menuItems?.length > 0) {
        menuItem = menuDoc.menuItems[0];
      }

      const qty = Number(item.quantity);

      if (!menuItem || !qty || qty < 1) {
        const error = new Error("Invalid order item or quantity");
        error.statusCode = 400;
        return next(error);
      }

      const basePrice = Number(menuItem.price) || 0;
      let customizationPrice = 0;
      let sanitizedCustomization = null;

      if (item.customization && (item.customization.isCustomized || item.customization.customizationPrice > 0 || item.customization.size || item.customization.specialInstructions)) {
        const sizeExtra = Number(item.customization.sizeExtra) || 0;
        const baseExtra = Number(item.customization.baseExtra) || 0;
        const addOnsTotal = Array.isArray(item.customization.selectedAddOns)
          ? item.customization.selectedAddOns.reduce(
              (sum, a) => sum + (Number(a.price) || 0),
              0
            )
          : 0;
        const saucesTotal = Array.isArray(item.customization.selectedSauces)
          ? item.customization.selectedSauces.reduce(
              (sum, s) => sum + (Number(s.price) || 0),
              0
            )
          : 0;

        customizationPrice =
          Number(item.customization.customizationPrice) ||
          (sizeExtra + baseExtra + addOnsTotal + saucesTotal);

        sanitizedCustomization = {
          isCustomized: true,
          size: item.customization.size || "",
          sizeExtra,
          baseOrCrust: item.customization.baseOrCrust || "",
          baseExtra,
          spiceLevel: item.customization.spiceLevel || "",
          selectedAddOns: Array.isArray(item.customization.selectedAddOns)
            ? item.customization.selectedAddOns
            : [],
          selectedSauces: Array.isArray(item.customization.selectedSauces)
            ? item.customization.selectedSauces
            : [],
          specialInstructions: item.customization.specialInstructions || "",
          customizationPrice,
        };
      }

      const itemUnitPrice = (item.isCustomMealStudio && item.price) ? Number(item.price) : (basePrice + customizationPrice);
      itemsAmount += itemUnitPrice * qty;

      normalizedOrderItems.push({
        itemId: menuItem._id,
        itemName: item.itemName || menuItem.itemName || "Customized Dish",
        price: itemUnitPrice,
        quantity: qty,
        customization: sanitizedCustomization || {
          isCustomized: false,
          size: "",
          sizeExtra: 0,
          baseOrCrust: "",
          baseExtra: 0,
          spiceLevel: "",
          selectedAddOns: [],
          selectedSauces: [],
          specialInstructions: "",
          customizationPrice: 0,
        },
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