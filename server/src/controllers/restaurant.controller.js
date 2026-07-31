import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";


// =========================================
// Get Restaurant Data
// =========================================
export const RestaurantGetData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const managerId = req.query.id;

    if (currentUser._id.toString() !== managerId) {
      const error = new Error("Unauthorized Access");
      error.statusCode = 401;
      return next(error);
    }

    const restaurantData = await Restaurant.find({ managerId });

    if (restaurantData.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Restaurant fetched successfully",
        data: restaurantData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "No restaurant data found",
      data: [],
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// =========================================
// Get Restaurant Profile
// =========================================
export const getRestaurantProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant profile not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant profile fetched successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
// Update Restaurant Profile
export const RestaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = req.body;

    const coverImageFromFE = req.files?.coverImage?.[0];
    const restaurantImageFromFE = req.files?.restaurantImage;

    const dataKeys = Object.keys(restaurantDataFromFE);

    // Parse social media links
    if (restaurantDataFromFE.socialMediaLinks) {
      try {
        restaurantDataFromFE.socialMediaLinks = JSON.parse(
          restaurantDataFromFE.socialMediaLinks
        );
      } catch (e) {
        console.error("Failed to parse socialMediaLinks", e);
      }
    }

    // Check existing restaurant
    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    // Create new restaurant
    if (!existingRestaurant) {
      for (const key of dataKeys) {
        if (!restaurantDataFromFE[key]) {
          const error = new Error(`Missing required field: ${key}`);
          error.statusCode = 400;
          return next(error);
        }
      }

      // Upload cover image
      if (coverImageFromFE) {
        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`
        );

        restaurantDataFromFE.coverImage = coverImage;
        dataKeys.push("coverImage");
      }

      // Upload restaurant images
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
        success: true,
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    }

    // Update cover image
    if (coverImageFromFE) {
      await deleteSingleImage(existingRestaurant.coverImage);

      const coverImage = await UploadSingleImage(
        coverImageFromFE,
        `restaurant/${currentUser.phone}/coverPhoto`
      );

      restaurantDataFromFE.coverImage = coverImage;
      dataKeys.push("coverImage");
    }

    // Keep selected restaurant images
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

    // Upload new restaurant images
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

    // Update restaurant fields
    dataKeys.forEach((key) => {
      if (restaurantDataFromFE[key] !== undefined) {
        existingRestaurant.set(key, restaurantDataFromFE[key]);
      }
    });

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant profile updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
// Change Restaurant Open/Close Status
export const toggleRestaurantStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant profile not found",
        data: null,
      });
    }

    existingRestaurant.isOpen = !existingRestaurant.isOpen;

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
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


// Update Restaurant Basic Information
export const RestaurantUpdateInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const {
      restaurantName,
      description,
      restaurantType,
      cuisineTypes,
      contactEmail,
      contactPhone,
      openingTime,
      closingTime,
    } = req.body;

    if (
      !restaurantName ||
      !description ||
      !restaurantType ||
      !cuisineTypes ||
      !contactEmail ||
      !contactPhone ||
      !openingTime ||
      !closingTime
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const cuisineTypesArray = cuisineTypes
      .split(",")
      .map((type) => type.trim());

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant profile not found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.restaurantName = restaurantName;
    existingRestaurant.description = description;
    existingRestaurant.restaurantType = restaurantType;
    existingRestaurant.cuisineTypes = cuisineTypesArray;

    existingRestaurant.contactDetails.email = contactEmail;
    existingRestaurant.contactDetails.phone = contactPhone;

    existingRestaurant.servingHours.openingTime = openingTime;
    existingRestaurant.servingHours.closingTime = closingTime;

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// Update Restaurant Legal Information
export const RestaurantUpdateLegalInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const { legalName, companyType } = req.body;

    if (!legalName || !companyType) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant profile not found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.legal = {
      legalName,
      companyType,
    };

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Legal information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
import Menu from "../models/menu.model.js";


// Add Menu Item
export const RestaurantAddMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const {
      itemName,
      description,
      price,
      category,
      foodType,
      status,
      isTopRated,
      isRecommended,
      isNew,
      isDeleted,
    } = req.body;

    const itemImageFromFE = req.file;

    // Validate required fields
    if (
      !itemName ||
      !description ||
      !price ||
      !category ||
      !foodType ||
      !status
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    if (!itemImageFromFE) {
      const error = new Error("Item image is required");
      error.statusCode = 400;
      return next(error);
    }

    // Check restaurant
    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }

    // Upload image
    const itemImage = await UploadSingleImage(
      itemImageFromFE,
      `restaurant/${currentUser.phone}/menuItems`
    );

    // Find existing menu
    const existingMenuItem = await Menu.findOne({
      restaurantId: existingRestaurant._id,
    });

    // Add into existing menu
    if (existingMenuItem) {
      existingMenuItem.menuItems.push({
        itemName,
        description,
        price,
        category,
        foodType,
        status,
        isTopRated,
        isRecommended,
        isNew,
        isDeleted,
        image: itemImage,
      });

      await existingMenuItem.save();

      return res.status(200).json({
        success: true,
        message: "Menu item added successfully",
        data: existingMenuItem,
      });
    }

    // Create new menu
    const newMenuItem = await Menu.create({
      restaurantId: existingRestaurant._id,
      menuItems: [
        {
          itemName,
          description,
          price,
          category,
          foodType,
          status,
          isTopRated,
          isRecommended,
          isNew,
          isDeleted,
          image: itemImage,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      data: newMenuItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// Get All Menu Items
export const RestaurantMenuItems = async (req, res, next) => {
  try {
    const currentUser = req.user;

    // Check restaurant
    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      return next(error);
    }

    // Get menu
    const existingMenuItem = await Menu.findOne({
      restaurantId: existingRestaurant._id,
    });

    if (!existingMenuItem) {
      const error = new Error("Menu items not found");
      error.statusCode = 404;
      return next(error);
    }

    // Return active items only
    const activeMenuItems = existingMenuItem.menuItems.filter(
      (item) => !item.isDeleted
    );

    return res.status(200).json({
      success: true,
      message: "Menu items fetched successfully",
      data: activeMenuItems,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
// Convert string value to boolean
const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};


// Get restaurant, menu and selected menu item
const getMenuContext = async (currentUser, itemId, next) => {
  const existingRestaurant = await Restaurant.findOne({
    managerId: currentUser._id,
  });

  if (!existingRestaurant) {
    const error = new Error("Restaurant not found");
    error.statusCode = 404;
    return next(error);
  }

  const existingMenu = await Menu.findOne({
    restaurantId: existingRestaurant._id,
  });

  if (!existingMenu) {
    const error = new Error("Menu items not found");
    error.statusCode = 404;
    return next(error);
  }

  const menuItem = existingMenu.menuItems.id(itemId);

  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.statusCode = 404;
    return next(error);
  }

  return {
    existingMenu,
    menuItem,
    existingRestaurant,
  };
};


// Update Menu Item
export const RestaurantUpdateMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const context = await getMenuContext(currentUser, itemId, next);

    if (!context) return;

    const { existingMenu, menuItem } = context;

    const {
      itemName,
      description,
      price,
      category,
      foodType,
      status,
    } = req.body;

    const itemImageFromFE = req.file;

    // Update text fields
    if (itemName !== undefined) menuItem.itemName = itemName;
    if (description !== undefined) menuItem.description = description;
    if (price !== undefined && price !== "")
      menuItem.price = Number(price);
    if (category !== undefined) menuItem.category = category;
    if (foodType !== undefined) menuItem.foodType = foodType;
    if (status !== undefined) menuItem.status = status;

    // Update boolean fields
    const isTopRated = parseBoolean(req.body.isTopRated);
    const isRecommended = parseBoolean(req.body.isRecommended);
    const isNew = parseBoolean(req.body.isNew);

    if (isTopRated !== undefined)
      menuItem.isTopRated = isTopRated;

    if (isRecommended !== undefined)
      menuItem.isRecommended = isRecommended;

    if (isNew !== undefined)
      menuItem.isNew = isNew;

    // Update item image
    if (itemImageFromFE) {
      await deleteSingleImage(menuItem.image);

      const updatedImage = await UploadSingleImage(
        itemImageFromFE,
        `restaurant/${currentUser.phone}/menuItems`
      );

      menuItem.image = updatedImage;
    }

    existingMenu.markModified("menuItems");

    await existingMenu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
// Update Menu Item Status
export const RestaurantUpdateMenuItemStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const status = req.query.status || req.body?.status;

    if (!status) {
      const error = new Error("Status is required");
      error.statusCode = 400;
      return next(error);
    }

    const allowedStatus = [
      "available",
      "unavailable",
      "discontinued",
    ];

    if (!allowedStatus.includes(status)) {
      const error = new Error("Invalid status value");
      error.statusCode = 400;
      return next(error);
    }

    const context = await getMenuContext(
      currentUser,
      itemId,
      next
    );

    if (!context) return;

    const { existingMenu, menuItem } = context;

    menuItem.status = status;

    existingMenu.markModified("menuItems");
    await existingMenu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item status updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// Toggle Menu Item Controls
export const RestaurantToggleMenuItemControl = async (
  req,
  res,
  next
) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const control =
      req.query.control || req.body?.control;

    const allowedControls = [
      "isTopRated",
      "isRecommended",
      "isNew",
    ];

    if (!allowedControls.includes(control)) {
      const error = new Error("Invalid control value");
      error.statusCode = 400;
      return next(error);
    }

    const context = await getMenuContext(
      currentUser,
      itemId,
      next
    );

    if (!context) return;

    const { existingMenu, menuItem } = context;

    menuItem[control] = !menuItem[control];

    existingMenu.markModified("menuItems");
    await existingMenu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item control updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};


// Delete Menu Item (Soft Delete)
export const RestaurantDeleteMenuItem = async (
  req,
  res,
  next
) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const context = await getMenuContext(
      currentUser,
      itemId,
      next
    );

    if (!context) return;

    const { existingMenu, menuItem } = context;

    menuItem.isDeleted = true;
    menuItem.status = "discontinued";

    existingMenu.markModified("menuItems");
    await existingMenu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      data: menuItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};