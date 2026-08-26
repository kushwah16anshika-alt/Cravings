import Contact from "../models/contact.model.js";
import Restaurant from "../models/restaurant.model.js";
import Menu from "../models/menu.model.js";
import Feedback from "../models/feedback.model.js";

export const ContactUsForm = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !phone || !subject || !message) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    await Contact.create({
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Thanks for Contacting us! You will hear back from us soon",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const FeedbackForm = async (req, res, next) => {
  try {
    const { fullName, email, category, rating, message } = req.body;

    if (!fullName || !email || !category || !rating || !message) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    await Feedback.create({
      fullName,
      email: email.toLowerCase().trim(),
      category,
      rating: Number(rating),
      message,
    });

    res.status(201).json({
      message: "Thanks for sharing your feedback! We appreciate your support.",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const GetAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate("managerId", "fullname email phone photo");

    res.status(200).json({
      data: restaurants,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const GetRestaurantDetails = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId).populate(
      "managerId",
      "fullname email phone photo"
    );

    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }

    const menu = await Menu.findOne({ restaurantId });
    const menuItems = menu?.menuItems ? menu.menuItems.filter((i) => !i.isDeleted) : [];

    res.status(200).json({
      data: {
        restaurantId: restaurant,
        menuItems: menuItems,
      },
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};