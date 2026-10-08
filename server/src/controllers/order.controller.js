import Customer from "../models/customer.model.js";
import Menu from "../models/menu.model.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import Rider from "../models/rider.model.js";

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

// ======================================
// GET ORDER TRACKING DETAILS
// ======================================
export const GetOrderTracking = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      const error = new Error("Order ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findById(orderId)
      .populate("restaurantId", "restaurantName address city state pinCode geoLocation contactDetails coverImage averageRating")
      .populate({
        path: "riderId",
        populate: {
          path: "riderId",
          select: "fullname phone photo",
        },
      });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    // Baseline coordinates
    const defaultRestLat = 12.9716;
    const defaultRestLng = 77.5946;

    const restLat = parseFloat(order.restaurantId?.geoLocation?.lat) || defaultRestLat;
    const restLng = parseFloat(order.restaurantId?.geoLocation?.lon) || defaultRestLng;

    // Delivery address coords (fallback: approx 2km north-east if missing)
    const destLat = parseFloat(order.deliveryAddress?.geoLocation?.lat) || (restLat + 0.0185);
    const destLng = parseFloat(order.deliveryAddress?.geoLocation?.lon) || (restLng + 0.0152);

    // Rider position calculation based on status
    const status = (order.orderStatus || "pending").toLowerCase();
    let riderProgress = 0; // 0 = at restaurant, 1 = at destination

    if (status === "delivered") {
      riderProgress = 1.0;
    } else if (status === "outfordelivery" || status === "ontheway") {
      riderProgress = 0.65;
    } else if (status === "pickedup") {
      riderProgress = 0.25;
    } else if (status === "ready" || status === "preparing" || status === "accepted") {
      riderProgress = 0.05;
    } else {
      riderProgress = 0.0;
    }

    const riderLat = restLat + (destLat - restLat) * riderProgress;
    const riderLng = restLng + (destLng - restLng) * riderProgress;

    const trackingData = {
      orderId: order._id,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      billDetails: order.billDetails,
      orderItems: order.orderItems,
      restaurant: {
        id: order.restaurantId?._id,
        name: order.restaurantId?.restaurantName || "Cravings Kitchen",
        address: order.restaurantId?.address || "Culinary Avenue",
        city: order.restaurantId?.city || "Bengaluru",
        phone: order.restaurantId?.contactDetails?.phone || "+91 98765 43201",
        rating: order.restaurantId?.averageRating || 4.8,
        coverImage: order.restaurantId?.coverImage?.url || "",
        location: {
          lat: restLat,
          lng: restLng,
        },
      },
      destination: {
        recipientName: order.deliveryAddress?.name || "Customer",
        address: order.deliveryAddress?.address || "Delivery Address",
        city: order.deliveryAddress?.city || "Bengaluru",
        state: order.deliveryAddress?.state || "Karnataka",
        pinCode: order.deliveryAddress?.pinCode || "560001",
        location: {
          lat: destLat,
          lng: destLng,
        },
      },
      rider: {
        name: order.riderId?.riderId?.fullname || "Rahul Sharma",
        phone: order.riderId?.riderId?.phone || "+91 98450 11223",
        photo: order.riderId?.riderId?.photo?.url || "",
        vehicle: order.riderId?.vehicleDetails?.vehicleModel 
          ? `${order.riderId.vehicleDetails.vehicleModel} (${order.riderId.vehicleDetails.vehicleNumber || 'KA-01-EA-4521'})`
          : "Honda Activa (KA-01-EA-4521)",
        vehicleType: order.riderId?.vehicleDetails?.vehicleType || "Electric Scooter",
        rating: order.riderId?.averageRating || 4.9,
        location: {
          lat: riderLat,
          lng: riderLng,
        },
        progress: riderProgress,
      },
      estimatedMinutes: status === "delivered" ? 0 : status === "outfordelivery" || status === "ontheway" ? 12 : 25,
      distanceKm: "2.4 km",
    };

    return res.status(200).json({
      message: "Order tracking details fetched successfully",
      data: trackingData,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// ======================================
// SIMULATE / ADVANCE ORDER STATUS (DEMO)
// ======================================
export const UpdateOrderStatusForDemo = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowed = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "pickedUp",
      "onTheWay",
      "outForDelivery",
      "delivered",
      "cancelled",
    ];

    if (!status || !allowed.includes(status)) {
      const error = new Error(`Invalid status. Allowed: ${allowed.join(", ")}`);
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};