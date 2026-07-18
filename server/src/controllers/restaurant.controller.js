import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";

export const RestaurantGetData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const managerId = req.query.id;

    console.log("Current User:", currentUser);
    console.log("Manager ID:", managerId);

    if (currentUser._id.toString() !== managerId) {
      const error = new Error("Unauthorized Access");
      error.statusCode = 401;
      return next(error);
    }

    const restaurantData = await Restaurant.find({ managerId });

    if (restaurantData.length > 0) {
      return res.status(200).json({
        message: "Restaurant Fetched Successfully",
        data: restaurantData,
      });
    }

    return res.status(200).json({
      message: "No Restaurant Data Found",
      data: [],
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getRestaurantProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant profile not found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Restaurant profile fetched successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const RestaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = req.body;
    const coverImageFromFE = req.files?.coverImage?.[0];
    const restaurantImageFromFE = req.files?.restaurantImage;

    const dataKeys = Object.keys(restaurantDataFromFE);

    if (restaurantDataFromFE.socialMediaLinks) {
      try {
        restaurantDataFromFE.socialMediaLinks = JSON.parse(
          restaurantDataFromFE.socialMediaLinks
        );
      } catch (e) {
        console.error("Failed to parse socialMediaLinks", e);
      }
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      for (const key of dataKeys) {
        if (!restaurantDataFromFE[key]) {
          const error = new Error(`Missing required field: ${key}`);
          error.statusCode = 400;
          return next(error);
        }
      }

      if (coverImageFromFE) {
        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`
        );

        restaurantDataFromFE.coverImage = coverImage;
        dataKeys.push("coverImage");
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        const restaurantImage = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`
        );

        restaurantDataFromFE.restaurantImage = restaurantImage;
        dataKeys.push("restaurantImage");
      }

      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...restaurantDataFromFE,
      });

      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    }

    if (coverImageFromFE) {
      await deleteSingleImage(existingRestaurant.coverImage);

      const coverImage = await UploadSingleImage(
        coverImageFromFE,
        `restaurant/${currentUser.phone}/coverPhoto`
      );

      restaurantDataFromFE.coverImage = coverImage;
      dataKeys.push("coverImage");
    }

    if (restaurantDataFromFE.existingRestaurantImages) {
      try {
        const keptImages = JSON.parse(
          restaurantDataFromFE.existingRestaurantImages
        );

        const keptImageUrls = keptImages.map((img) => img.url);

        const imagesToDelete = existingRestaurant.restaurantImage.filter(
          (img) => !keptImageUrls.includes(img.url)
        );

        if (imagesToDelete.length > 0) {
          await deleteMultipleImages(imagesToDelete);
        }

        restaurantDataFromFE.restaurantImage = keptImages;
        dataKeys.push("restaurantImage");
      } catch (e) {
        console.error("Failed to parse existingRestaurantImages", e);
      }
    }

    if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
      const newImages = await uploadMultipleImages(
        restaurantImageFromFE,
        `restaurant/${currentUser.phone}/restaurantPhotos`
      );

      dataKeys.push("restaurantImage");

      if (restaurantDataFromFE.restaurantImage) {
        restaurantDataFromFE.restaurantImage = [
          ...restaurantDataFromFE.restaurantImage,
          ...newImages,
        ];
      } else {
        restaurantDataFromFE.restaurantImage = newImages;
      }
    }

    dataKeys.forEach((key) => {
      if (restaurantDataFromFE[key] !== undefined) {
        existingRestaurant.set(key, restaurantDataFromFE[key]);
      }
    });

    await existingRestaurant.save();

    return res.status(200).json({
      message: "Restaurant profile updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const toggleRestaurantStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant profile not found",
        data: null,
      });
    }

    existingRestaurant.isOpen = !existingRestaurant.isOpen;

    await existingRestaurant.save();

    return res.status(200).json({
      message: `Restaurant is now ${
        existingRestaurant.isOpen ? "Open" : "Closed"
      }`,
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};