// import Rider from "../models/rider.model.js";

// export const getRiderProfile = async (req, res, next) => {
//   try {
//     const currentUser = req.user;
//     const existingRider = await Rider.findOne({
//       riderId: currentUser._id,
//     });

//     if (!existingRider) {
//       return res.status(404).json({
//         message: "Rider profile not found",
//         data: null,
//       });
//     }

//     return res.status(200).json({
//       message: "Rider profile fetched successfully",
//       data: existingRider,
//     });
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// };

// export const riderUpdateProfile = async (req, res, next) => {
//   try {
//     const currentUser = req.user;
//     const riderDataFromFE = req.body;

//     const dataKeys = Object.keys(riderDataFromFE);

//     const existingRider = await Rider.findOne({
//       riderId: currentUser._id,
//     });

//     if (!existingRider) {
//       const newRider = await Rider.create({
//         riderId: currentUser._id,
//         ...riderDataFromFE,
//       });
//       return res.status(201).json({
//         message: "Rider profile created successfully",
//         data: newRider,
//       });
//     } else {
//       dataKeys.forEach((key) => {
//         if (riderDataFromFE[key] !== undefined) {
//           existingRider.set(key, riderDataFromFE[key]);
//         }
//       });
//       await existingRider.save();
//       return res.status(200).json({
//         message: "Rider profile updated successfully",
//         data: existingRider,
//       });
//     }
//   } catch (error) {
//     console.log(error.message);
//     next(error);
//   }
// };

import Rider from "../models/rider.model.js";

// ======================================
// GET RIDER PROFILE
// ======================================
export const getRiderProfile = async (req, res, next) => {
  try {
    // RiderAuthProtect middleware should set req.user
    const currentUser = req.user;

    const existingRider = await Rider.findOne({
      riderId: currentUser._id,
    });

    if (!existingRider) {
      return res.status(404).json({
        message: "Rider profile not found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Rider profile fetched successfully",
      data: existingRider,
    });

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// ======================================
// CREATE / UPDATE RIDER PROFILE
// ======================================
export const riderUpdateProfile = async (req, res, next) => {
  try {
    // Logged-in rider
    const currentUser = req.user;

    // Data coming from frontend
    const riderDataFromFE = req.body;

    // Get keys from frontend data
    const dataKeys = Object.keys(riderDataFromFE);

    // Find rider profile
    const existingRider = await Rider.findOne({
      riderId: currentUser._id,
    });

    // ======================================
    // CREATE NEW RIDER PROFILE
    // ======================================
    if (!existingRider) {
      const newRider = await Rider.create({
        riderId: currentUser._id,
        ...riderDataFromFE,
      });

      return res.status(201).json({
        message: "Rider profile created successfully",
        data: newRider,
      });
    }

    // ======================================
    // UPDATE EXISTING RIDER PROFILE
    // ======================================
    dataKeys.forEach((key) => {
      if (riderDataFromFE[key] !== undefined) {
        existingRider.set(key, riderDataFromFE[key]);
      }
    });

    await existingRider.save();

    return res.status(200).json({
      message: "Rider profile updated successfully",
      data: existingRider,
    });

  } catch (error) {
    console.log(error.message);
    next(error);
  }
};