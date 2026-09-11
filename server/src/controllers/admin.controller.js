import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Feedback from "../models/feedback.model.js";
import Contact from "../models/contact.model.js";
import Menu from "../models/menu.model.js";

// ==========================================
// 1. GET ADMIN OVERVIEW STATS & RECENT ORDERS
// ==========================================
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Orders count & Revenue aggregation
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.find({
      $or: [{ "paymentDetails.paymentStatus": "completed" }, { orderStatus: "delivered" }],
    }).select("billDetails orderStatus createdAt");

    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + (o.billDetails?.finalAmount || 0),
      0
    );

    const totalPlatformFee = completedOrders.reduce(
      (sum, o) => sum + (o.billDetails?.platformFee || 0),
      0
    );

    // Order status counts
    const pendingOrders = await Order.countDocuments({ orderStatus: "pending" });
    const preparingOrders = await Order.countDocuments({
      orderStatus: { $in: ["accepted", "preparing", "ready"] },
    });
    const onTheWayOrders = await Order.countDocuments({
      orderStatus: { $in: ["pickedUp", "onTheWay", "outForDelivery"] },
    });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" });
    const cancelledOrders = await Order.countDocuments({
      orderStatus: { $in: ["cancelled", "failed", "rejected"] },
    });

    // 2. Users count by roles
    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({
      userType: { $in: ["user", "customer"] },
    });
    const restaurantManagersCount = await User.countDocuments({ userType: "restaurant" });
    const riderCount = await User.countDocuments({ userType: "rider" });

    // 3. Restaurants count
    const totalRestaurants = await Restaurant.countDocuments();
    const activeRestaurants = await Restaurant.countDocuments({ isOpen: true });

    // 4. Feedback & Contacts count
    const totalFeedbacks = await Feedback.countDocuments();
    const totalContacts = await Contact.countDocuments();

    // 5. Recent 8 Orders
    const recentOrders = await Order.find()
      .populate("restaurantId", "restaurantName coverImage address city")
      .populate({
        path: "customerId",
        populate: {
          path: "customerId",
          select: "fullname email phone photo",
        },
      })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    // Normalize recent orders to include customer user info cleanly
    const formattedRecentOrders = recentOrders.map((ord) => {
      const custUser = ord.customerId?.customerId;
      return {
        _id: ord._id,
        restaurantName: ord.restaurantId?.restaurantName || "Featured Kitchen",
        restaurantCover: ord.restaurantId?.coverImage?.url || "",
        customerName: ord.deliveryAddress?.name || custUser?.fullname || "Student",
        customerEmail: custUser?.email || "",
        customerPhone: custUser?.phone || "",
        itemsCount: ord.orderItems?.length || 0,
        orderItems: ord.orderItems,
        finalAmount: ord.billDetails?.finalAmount || 0,
        paymentStatus: ord.paymentDetails?.paymentStatus || "pending",
        paymentMethod: ord.paymentDetails?.paymentMethod || "upi",
        orderStatus: ord.orderStatus,
        createdAt: ord.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      message: "Admin statistics retrieved successfully",
      data: {
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalPlatformFee: Math.round(totalPlatformFee * 100) / 100,
          totalOrders,
          pendingOrders,
          preparingOrders,
          onTheWayOrders,
          deliveredOrders,
          cancelledOrders,
          totalUsers,
          customerCount,
          restaurantManagersCount,
          riderCount,
          totalRestaurants,
          activeRestaurants,
          totalFeedbacks,
          totalContacts,
        },
        recentOrders: formattedRecentOrders,
      },
    });
  } catch (error) {
    console.error("getAdminStats Error:", error);
    next(error);
  }
};

// ==========================================
// 2. GET ALL PLATFORM ORDERS (WITH FILTERS)
// ==========================================
export const getAllAdminOrders = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    const filter = {};
    if (status && status !== "all") {
      if (status === "active") {
        filter.orderStatus = {
          $in: ["pending", "accepted", "preparing", "ready", "pickedUp", "onTheWay", "outForDelivery"],
        };
      } else {
        filter.orderStatus = status;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .populate("restaurantId", "restaurantName coverImage address city phone")
      .populate({
        path: "customerId",
        populate: {
          path: "customerId",
          select: "fullname email phone photo",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalCount = await Order.countDocuments(filter);

    let formattedOrders = orders.map((ord) => {
      const custUser = ord.customerId?.customerId;
      return {
        _id: ord._id,
        restaurantId: ord.restaurantId?._id,
        restaurantName: ord.restaurantId?.restaurantName || "Featured Kitchen",
        restaurantPhone: ord.restaurantId?.phone || "",
        customerName: ord.deliveryAddress?.name || custUser?.fullname || "Student",
        customerEmail: custUser?.email || "",
        customerPhone: custUser?.phone || "",
        deliveryAddress: ord.deliveryAddress,
        orderItems: ord.orderItems || [],
        itemsCount: ord.orderItems?.length || 0,
        billDetails: ord.billDetails,
        finalAmount: ord.billDetails?.finalAmount || 0,
        paymentDetails: ord.paymentDetails,
        orderStatus: ord.orderStatus,
        createdAt: ord.createdAt,
        updatedAt: ord.updatedAt,
      };
    });

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      formattedOrders = formattedOrders.filter(
        (o) =>
          o._id.toString().toLowerCase().includes(q) ||
          o.restaurantName.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerPhone.includes(q)
      );
    }

    res.status(200).json({
      success: true,
      totalCount,
      page: Number(page),
      data: formattedOrders,
    });
  } catch (error) {
    console.error("getAllAdminOrders Error:", error);
    next(error);
  }
};

// ==========================================
// 3. UPDATE ORDER STATUS (ADMIN OVERRIDE)
// ==========================================
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      return next(err);
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus && order.paymentDetails) {
      order.paymentDetails.paymentStatus = paymentStatus;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      data: order,
    });
  } catch (error) {
    console.error("updateAdminOrderStatus Error:", error);
    next(error);
  }
};

// ==========================================
// 4. GET ALL RESTAURANTS
// ==========================================
export const getAllAdminRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("managerId", "fullname email phone photo")
      .sort({ createdAt: -1 })
      .lean();

    const allMenus = await Menu.find().select("restaurantId menuItems").lean();

    const formatted = restaurants.map((r) => {
      const menuDoc = allMenus.find(
        (m) => m.restaurantId?.toString() === r._id.toString()
      );
      const menuCount = (menuDoc?.menuItems || []).filter((i) => !i.isDeleted).length;

      return {
        _id: r._id,
        restaurantName: r.restaurantName,
        manager: r.managerId
          ? {
              fullname: r.managerId.fullname,
              email: r.managerId.email,
              phone: r.managerId.phone,
            }
          : null,
        cuisineTypes: r.cuisineTypes || [],
        address: r.address,
        city: r.city || r.address?.city || "Downtown",
        averageRating: r.averageRating || 4.2,
        isOpen: r.isOpen !== undefined ? r.isOpen : true,
        restaurantType: r.restaurantType || "both",
        costForTwo: r.costForTwo || "₹250 for two",
        deliveryTime: r.deliveryTime || "15-25 min",
        coverImage: r.coverImage?.url || "",
        menuCount,
        createdAt: r.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("getAllAdminRestaurants Error:", error);
    next(error);
  }
};

// ==========================================
// 5. TOGGLE RESTAURANT OPERATIONAL STATUS
// ==========================================
export const toggleAdminRestaurantStatus = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { isOpen } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      const err = new Error("Restaurant not found");
      err.statusCode = 404;
      return next(err);
    }

    restaurant.isOpen = isOpen !== undefined ? isOpen : !restaurant.isOpen;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: `${restaurant.restaurantName} is now ${restaurant.isOpen ? "OPEN" : "CLOSED"}`,
      data: {
        _id: restaurant._id,
        isOpen: restaurant.isOpen,
      },
    });
  } catch (error) {
    console.error("toggleAdminRestaurantStatus Error:", error);
    next(error);
  }
};

// ==========================================
// 6. GET ALL REGISTERED USERS & RIDERS
// ==========================================
export const getAllAdminUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    const query = {};
    if (role && role !== "all") {
      if (role === "customer") {
        query.userType = { $in: ["user", "customer"] };
      } else {
        query.userType = role;
      }
    }

    let users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      users = users.filter(
        (u) =>
          u.fullname?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("getAllAdminUsers Error:", error);
    next(error);
  }
};

// ==========================================
// 7. GET FEEDBACKS & CONTACT INQUIRIES
// ==========================================
export const getAdminFeedbackAndInquiries = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(100).lean();
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100).lean();

    res.status(200).json({
      success: true,
      data: {
        feedbacks,
        contacts,
      },
    });
  } catch (error) {
    console.error("getAdminFeedbackAndInquiries Error:", error);
    next(error);
  }
};
