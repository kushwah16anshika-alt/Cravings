// import Contact from "../models/contact.model.js";
// import Feedback from "../models/feedback.model.js";

// export const validateFeedbackPayload = (data = {}) => {
//   const errors = {};

//   if (!data.fullName?.trim()) {
//     errors.fullName = "Full name is required";
//   }

//   if (!data.email?.trim()) {
//     errors.email = "Email is required";
//   } else if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
//     errors.email = "Please enter a valid email";
//   }

//   if (!data.category?.trim()) {
//     errors.category = "Category is required";
//   }

//   if (!data.message?.trim()) {
//     errors.message = "Message is required";
//   }

//   if (!data.rating) {
//     errors.rating = "Rating is required";
//   }

//   return {
//     ok: Object.keys(errors).length === 0,
//     errors,
//   };
// };

// export const ContactUsForm = async (req, res, next) => {
//   try {
//     const { fullName, email, phone, subject, message } = req.body;

//     if (!fullName || !email || !phone || !subject || !message) {
//       const error = new Error("All fields Required");
//       error.statusCode = 400;
//       return next(error);
//     }

//     await Contact.create({
//       fullName,
//       email,
//       phone,
//       subject,
//       message,
//     });

//     res.status(201).json({
//       message: "Thanks for Contacting us! You will hear back from us soon",
//     });
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// };

// export const FeedbackForm = async (req, res, next) => {
//   try {
//     const validation = validateFeedbackPayload(req.body);

//     if (!validation.ok) {
//       const error = new Error("Please fill the required fields correctly");
//       error.statusCode = 400;
//       error.details = validation.errors;
//       return next(error);
//     }

//     const {
//       fullName,
//       email,
//       category,
//       rating,
//       message,
//     } = req.body;

//     await Feedback.create({
//       fullName,
//       email,
//       category,
//       rating: Number(rating),
//       message,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Thanks for your feedback! We appreciate your input.",
//     });
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// };

import Contact from "../models/contact.model.js";
import Feedback from "../models/feedback.model.js";
import Restaurant from "../models/restaurant.model.js";


// Feedback Validation
export const validateFeedbackPayload = (data = {}) => {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email";
  }

  if (!data.category?.trim()) {
    errors.category = "Category is required";
  }

  if (!data.message?.trim()) {
    errors.message = "Message is required";
  }

  if (!data.rating) {
    errors.rating = "Rating is required";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
};



// Contact Us API
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
      email,
      phone,
      subject,
      message,
    });


    res.status(201).json({
      success: true,
      message: "Thanks for Contacting us! You will hear back from us soon",
    });


  } catch (error) {
    console.log(error.message);
    next(error);
  }
};




// Feedback API
export const FeedbackForm = async (req, res, next) => {
  try {

    const validation = validateFeedbackPayload(req.body);


    if (!validation.ok) {
      const error = new Error(
        "Please fill the required fields correctly"
      );

      error.statusCode = 400;
      error.details = validation.errors;

      return next(error);
    }


    const {
      fullName,
      email,
      category,
      rating,
      message,
    } = req.body;


    await Feedback.create({
      fullName,
      email,
      category,
      rating: Number(rating),
      message,
    });


    res.status(201).json({
      success: true,
      message: "Thanks for your feedback! We appreciate your input.",
    });


  } catch (error) {
    console.log(error.message);
    next(error);
  }
};




// Get All Restaurants API
export const GetRestaurants = async (req, res, next) => {
  try {

    const restaurants = await Restaurant.find();


    res.status(200).json({
      success: true,
      message: "Restaurants fetched successfully",
      restaurants,
    });


  } catch (error) {

    console.log(error.message);
    next(error);

  }
};