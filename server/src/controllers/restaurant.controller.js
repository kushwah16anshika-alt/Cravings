import Restaurant from "../models/restaurant.model.js";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";
import Menu from "../models/menu.model.js";

// =========================================
// Get Restaurant Data
// =========================================
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

    const restaurantData = await Restaurant.findOne({ managerId });

    if (restaurantData) {
      return res.status(200).json({
        message: "Restaurant Fetched Successfully",
        data: restaurantData,
      });
    }

    return res.status(200).json({
      message: "No restaurant Data Found",
      data: {},
    });
  } catch (error) {
    console.log("RestaurantGetData error:", error);
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

// =========================================
// Update Restaurant Profile
// =========================================
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

    // =========================================
    // Create New Restaurant
    // =========================================
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
      if (
        restaurantImageFromFE &&
        restaurantImageFromFE.length > 0
      ) {
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

    // =========================================
    // Update Cover Image
    // =========================================
    if (coverImageFromFE) {
      if (existingRestaurant.coverImage) {
        await deleteSingleImage(existingRestaurant.coverImage);
      }

      const coverImage = await UploadSingleImage(
        coverImageFromFE,
        `restaurant/${currentUser.phone}/coverPhoto`
      );

      restaurantDataFromFE.coverImage = coverImage;
      dataKeys.push("coverImage");
    }

    // =========================================
    // Keep Selected Restaurant Images
    // =========================================
    if (restaurantDataFromFE.existingRestaurantImages) {
      try {
        const keptImages = JSON.parse(
          restaurantDataFromFE.existingRestaurantImages
        );

        const keptImageUrls = keptImages.map((img) => img.url);

        const imagesToDelete =
          existingRestaurant.restaurantImage.filter(
            (img) => !keptImageUrls.includes(img.url)
          );

        if (imagesToDelete.length > 0) {
          await deleteMultipleImages(imagesToDelete);
        }

        restaurantDataFromFE.restaurantImage = keptImages;
        dataKeys.push("restaurantImage");
      } catch (e) {
        console.error(
          "Failed to parse existingRestaurantImages",
          e
        );
      }
    }

    // =========================================
    // Upload New Restaurant Images
    // =========================================
    if (
      restaurantImageFromFE &&
      restaurantImageFromFE.length > 0
    ) {
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

    // =========================================
    // Update Restaurant Fields
    // =========================================
    dataKeys.forEach((key) => {
      if (restaurantDataFromFE[key] !== undefined) {
        existingRestaurant.set(
          key,
          restaurantDataFromFE[key]
        );
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

// =========================================
// Change Restaurant Open/Close Status
// =========================================
export const toggleRestaurantStatus = async (
  req,
  res,
  next
) => {
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

    existingRestaurant.isOpen =
      !existingRestaurant.isOpen;

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

// =========================================
// Open Restaurant
// =========================================
export const OpenRestaurant = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const OpenStatus = req.params.openStatus;

    console.log("Open Status is", OpenStatus);

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error("Restaurant Not Found");
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.isOpen = OpenStatus === "true";

    await existingRestaurant.save();

    return res.status(200).json({
      message: `${
        OpenStatus === "true"
          ? "Restaurant is Live Now"
          : "Restaurant is Offline"
      }`,
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// =========================================
// Update Restaurant Basic Information
// =========================================
export const RestaurantUpdateInfo = async (
  req,
  res,
  next
) => {
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
      const error = new Error(
        "All fields are required"
      );
      error.statusCode = 400;
      return next(error);
    }

    const cuisineTypesArray = cuisineTypes
      .split(",")
      .map((type) => type.trim());

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    // Create restaurant if it doesn't exist
    if (!existingRestaurant) {
      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        restaurantName,
        description,
        restaurantType,
        cuisineTypes: cuisineTypesArray,
        contactDetails: {
          email: contactEmail,
          phone: contactPhone,
        },
        servingHours: {
          openingTime,
          closingTime,
        },
      });

      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    }

    // Update existing restaurant
    existingRestaurant.restaurantName = restaurantName;
    existingRestaurant.description = description;
    existingRestaurant.restaurantType = restaurantType;
    existingRestaurant.cuisineTypes = cuisineTypesArray;

    existingRestaurant.contactDetails.email =
      contactEmail;

    existingRestaurant.contactDetails.phone =
      contactPhone;

    existingRestaurant.servingHours.openingTime =
      openingTime;

    existingRestaurant.servingHours.closingTime =
      closingTime;

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

// =========================================
// Update Restaurant Legal Information
// =========================================
export const RestaurantUpdateLegalInfo = async (
  req,
  res,
  next
) => {
  try {
    const currentUser = req.user;
    const { legalName, companyType } = req.body;

    if (!legalName || !companyType) {
      const error = new Error(
        "All fields are required"
      );
      error.statusCode = 400;
      return next(error);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      const error = new Error(
        "Restaurant Not Found"
      );
      error.statusCode = 404;
      return next(error);
    }

    if (!existingRestaurant.documents) {
      existingRestaurant.documents = {};
    }
    existingRestaurant.documents.legalName = legalName;
    existingRestaurant.documents.companyType = companyType;

    await existingRestaurant.save();

    return res.status(200).json({
      message: "Legal information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// =========================================
// Add Menu Item
// =========================================
export const RestaurantAddMenuItem = async (
  req,
  res,
  next
) => {
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

    if (
      !itemName ||
      !description ||
      !price ||
      !category ||
      !foodType
    ) {
      const error = new Error(
        "All required fields must be filled (name, description, price, category, food type)"
      );
      error.statusCode = 400;
      return next(error);
    }

    if (!itemImageFromFE) {
      const error = new Error(
        "Item image is required"
      );
      error.statusCode = 400;
      return next(error);
    }

    let existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      existingRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        restaurantName: currentUser.fullname ? `${currentUser.fullname}'s Kitchen` : "My Restaurant",
        contactDetails: {
          email: currentUser.email || "",
          phone: currentUser.phone || "",
        },
      });
    }

    const uploadLocation = `restaurant/${currentUser.phone || currentUser._id}/menuItems`;
    const itemImage = await UploadSingleImage(
      itemImageFromFE,
      uploadLocation
    );

    const toBool = (val) => val === true || val === "true";
    const parsedPrice = Number(price) || 0;

    const menuItemData = {
      itemName: itemName.trim(),
      description: description.trim(),
      price: parsedPrice,
      category: category.trim(),
      foodType: foodType.trim(),
      status: status || "available",
      isTopRated: toBool(isTopRated),
      isRecommended: toBool(isRecommended),
      isNew: toBool(isNew),
      isDeleted: toBool(isDeleted),
      image: itemImage,
    };

    let existingMenuItem = await Menu.findOne({
      restaurantId: existingRestaurant._id,
    });

    if (existingMenuItem) {
      existingMenuItem.menuItems.push(menuItemData);

      await existingMenuItem.save();

      return res.status(200).json({
        message: "Menu item added successfully",
        data: existingMenuItem,
      });
    }

    const newMenuItem = await Menu.create({
      restaurantId: existingRestaurant._id,
      menuItems: [menuItemData],
    });

    return res.status(201).json({
      message: "Menu item added successfully",
      data: newMenuItem,
    });
  } catch (error) {
    console.log("RestaurantAddMenuItem error:", error.message);
    next(error);
  }
};

// =========================================
// Get All Menu Items
// =========================================
export const RestaurantMenuItems = async (req, res, next) => {
  try {
    console.log("========== GET MENU ITEMS ==========");

    // 1. Check logged-in user
    const currentUser = req.user;

    console.log("Current User ID:", currentUser?._id);
    console.log("Current User Type:", currentUser?.userType);

    if (!currentUser) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    // 2. Find restaurant
    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    console.log("Restaurant:", existingRestaurant);

    if (!existingRestaurant) {
      return res.status(200).json({
        message: "No menu items found",
        data: [],
      });
    }

    console.log("Restaurant ID:", existingRestaurant._id);

    // 3. Find menu
    const existingMenu = await Menu.findOne({
      restaurantId: existingRestaurant._id,
    });

    console.log("Menu:", existingMenu);

    // Restaurant has no menu yet
    if (!existingMenu) {
      return res.status(200).json({
        message: "No menu items found",
        data: [],
      });
    }

    // 4. Check menuItems
    console.log("Menu Items:", existingMenu.menuItems);

    if (!Array.isArray(existingMenu.menuItems)) {
      const error = new Error("menuItems is not an array");
      error.statusCode = 500;
      return next(error);
    }

    // 5. Remove deleted items
    const activeMenuItems = existingMenu.menuItems.filter(
      (item) => !item.isDeleted
    );

    console.log("Active Menu Items:", activeMenuItems);

    // 6. Send response
    return res.status(200).json({
      message: "Menu items fetched successfully",
      data: activeMenuItems,
    });

  } catch (error) {
    console.error("RestaurantMenuItems ERROR:");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    next(error);
  }
};

// =========================================
// Convert string value to boolean
// =========================================
const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;

  return undefined;
};

// =========================================
// Get Menu Context
// =========================================
const getMenuContext = async (
  currentUser,
  itemId,
  next
) => {
  const existingRestaurant = await Restaurant.findOne({
    managerId: currentUser._id,
  });

  if (!existingRestaurant) {
    const error = new Error(
      "Restaurant Not Found"
    );
    error.statusCode = 404;
    return next(error);
  }

  const existingMenu = await Menu.findOne({
    restaurantId: existingRestaurant._id,
  });

  if (!existingMenu) {
    const error = new Error(
      "Menu Items Not Found"
    );
    error.statusCode = 404;
    return next(error);
  }

  const menuItem =
    existingMenu.menuItems.id(itemId);

  if (!menuItem) {
    const error = new Error(
      "Menu Item Not Found"
    );
    error.statusCode = 404;
    return next(error);
  }

  return {
    existingMenu,
    menuItem,
    existingRestaurant,
  };
};

// =========================================
// Update Menu Item
// =========================================
export const RestaurantUpdateMenuItem = async (
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

    const {
      existingMenu,
      menuItem,
    } = context;

    const {
      itemName,
      description,
      price,
      category,
      foodType,
      status,
    } = req.body;

    const itemImageFromFE = req.file;

    if (itemName !== undefined)
      menuItem.itemName = itemName;

    if (description !== undefined)
      menuItem.description = description;

    if (price !== undefined && price !== "")
      menuItem.price = Number(price);

    if (category !== undefined)
      menuItem.category = category;

    if (foodType !== undefined)
      menuItem.foodType = foodType;

    if (status !== undefined)
      menuItem.status = status;

    const isTopRated = parseBoolean(
      req.body.isTopRated
    );

    const isRecommended = parseBoolean(
      req.body.isRecommended
    );

    const isNew = parseBoolean(
      req.body.isNew
    );

    if (isTopRated !== undefined)
      menuItem.isTopRated = isTopRated;

    if (isRecommended !== undefined)
      menuItem.isRecommended = isRecommended;

    if (isNew !== undefined)
      menuItem.isNew = isNew;

    if (itemImageFromFE) {
      if (menuItem.image) {
        await deleteSingleImage(menuItem.image);
      }

      const updatedImage =
        await UploadSingleImage(
          itemImageFromFE,
          `restaurant/${currentUser.phone}/menuItems`
        );

      menuItem.image = updatedImage;
    }

    existingMenu.markModified("menuItems");

    await existingMenu.save();

    return res.status(200).json({
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// =========================================
// Update Menu Item Status
// =========================================
export const RestaurantUpdateMenuItemStatus =
  async (req, res, next) => {
    try {
      const currentUser = req.user;
      const { itemId } = req.params;

      const status =
        req.query.status ||
        req.body?.status;

      if (!status) {
        const error = new Error(
          "Status is required"
        );
        error.statusCode = 400;
        return next(error);
      }

      const allowedStatus = [
        "available",
        "unavailable",
        "discontinued",
      ];

      if (!allowedStatus.includes(status)) {
        const error = new Error(
          "Invalid status value"
        );
        error.statusCode = 400;
        return next(error);
      }

      const context =
        await getMenuContext(
          currentUser,
          itemId,
          next
        );

      if (!context) return;

      const {
        existingMenu,
        menuItem,
      } = context;

      menuItem.status = status;

      existingMenu.markModified(
        "menuItems"
      );

      await existingMenu.save();

      return res.status(200).json({
        message:
          "Menu item status updated successfully",
        data: menuItem,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };

// =========================================
// Toggle Menu Item Controls
// =========================================
export const RestaurantToggleMenuItemControl =
  async (req, res, next) => {
    try {
      const currentUser = req.user;
      const { itemId } = req.params;

      const control =
        req.query.control ||
        req.body?.control;

      const allowedControls = [
        "isTopRated",
        "isRecommended",
        "isNew",
      ];

      if (!allowedControls.includes(control)) {
        const error = new Error(
          "Invalid control value"
        );
        error.statusCode = 400;
        return next(error);
      }

      const context =
        await getMenuContext(
          currentUser,
          itemId,
          next
        );

      if (!context) return;

      const {
        existingMenu,
        menuItem,
      } = context;

      menuItem[control] =
        !menuItem[control];

      existingMenu.markModified(
        "menuItems"
      );

      await existingMenu.save();

      return res.status(200).json({
        message:
          "Menu item control updated successfully",
        data: menuItem,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };

// =========================================
// Delete Menu Item - Soft Delete
// =========================================
export const RestaurantDeleteMenuItem =
  async (req, res, next) => {
    try {
      const currentUser = req.user;
      const { itemId } = req.params;

      const context =
        await getMenuContext(
          currentUser,
          itemId,
          next
        );

      if (!context) return;

      const {
        existingMenu,
        menuItem,
      } = context;

      menuItem.isDeleted = true;
      menuItem.status = "discontinued";

      existingMenu.markModified(
        "menuItems"
      );

      await existingMenu.save();

      return res.status(200).json({
        message:
          "Menu item deleted successfully",
        data: menuItem,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };

// =========================================
// Update Restaurant Address
// =========================================
export const RestaurantUpdateAddress = async (
  req,
  res,
  next
) => {
  try {
    const currentUser = req.user;

    const {
      address,
      city,
      state,
      pinCode,
      country,
      geoLat,
      geoLon,
    } = req.body;

    const existingRestaurant =
      await Restaurant.findOne({
        managerId: currentUser._id,
      });

    if (!existingRestaurant) {
      const error = new Error(
        "Restaurant Not Found"
      );
      error.statusCode = 404;
      return next(error);
    }

    existingRestaurant.address =
      address ?? existingRestaurant.address;

    existingRestaurant.city =
      city ?? existingRestaurant.city;

    existingRestaurant.state =
      state ?? existingRestaurant.state;

    existingRestaurant.pinCode =
      pinCode ?? existingRestaurant.pinCode;

    existingRestaurant.country =
      country ?? existingRestaurant.country;

    if (
      geoLat !== undefined &&
      geoLon !== undefined
    ) {
      existingRestaurant.geoLocation = {
        lat: String(geoLat),
        lon: String(geoLon),
      };
    }

    await existingRestaurant.save();

    return res.status(200).json({
      message: "Address updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// =========================================
// Update Restaurant Banking Documents
// =========================================
export const RestaurantUpdateBankingDocuments =
  async (req, res, next) => {
    try {
      const currentUser = req.user;

      const {
        bankName,
        accountNumber,
        ifscCode,
        panCard,
        gst,
        fssai,
      } = req.body;

      const existingRestaurant =
        await Restaurant.findOne({
          managerId: currentUser._id,
        });

      if (!existingRestaurant) {
        const error = new Error(
          "Restaurant Not Found"
        );
        error.statusCode = 404;
        return next(error);
      }

      existingRestaurant.financialDetails = {
        bankName:
          bankName ??
          existingRestaurant.financialDetails
            ?.bankName ??
          "",

        accountNumber:
          accountNumber ??
          existingRestaurant.financialDetails
            ?.accountNumber ??
          "",

        ifscCode:
          ifscCode ??
          existingRestaurant.financialDetails
            ?.ifscCode ??
          "",
      };

      existingRestaurant.documents = {
        panCard:
          panCard ??
          existingRestaurant.documents
            ?.panCard ??
          "",

        gstCertificate:
          gst ??
          existingRestaurant.documents
            ?.gstCertificate ??
          "",

        fssaiCertificate:
          fssai ??
          existingRestaurant.documents
            ?.fssaiCertificate ??
          "",
      };

      await existingRestaurant.save();

      return res.status(200).json({
        message:
          "Banking & Documents updated successfully",
        data: existingRestaurant,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };

// =========================================
// Update Restaurant Social Media Links
// =========================================
export const RestaurantUpdateSocialMediaLinks =
  async (req, res, next) => {
    try {
      const currentUser = req.user;
      const { socialMediaLinks } = req.body;

      if (!Array.isArray(socialMediaLinks)) {
        const error = new Error(
          "socialMediaLinks must be an array"
        );
        error.statusCode = 400;
        return next(error);
      }

      const existingRestaurant =
        await Restaurant.findOne({
          managerId: currentUser._id,
        });

      if (!existingRestaurant) {
        const error = new Error(
          "Restaurant Not Found"
        );
        error.statusCode = 404;
        return next(error);
      }

      existingRestaurant.socialMediaLinks =
        socialMediaLinks;

      await existingRestaurant.save();

      return res.status(200).json({
        message:
          "Social media links updated successfully",
        data: existingRestaurant,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };

// =========================================
// Update Restaurant Cover Photo
// =========================================
export const RestaurantUpdateCoverPhoto =
  async (req, res, next) => {
    try {
      const currentUser = req.user;
      const coverImageFromFE = req.file;

      if (!coverImageFromFE) {
        const error = new Error(
          "Cover image is required"
        );
        error.statusCode = 400;
        return next(error);
      }

      const existingRestaurant =
        await Restaurant.findOne({
          managerId: currentUser._id,
        });

      if (!existingRestaurant) {
        const error = new Error(
          "Restaurant Not Found"
        );
        error.statusCode = 404;
        return next(error);
      }

      if (existingRestaurant.coverImage) {
        await deleteSingleImage(
          existingRestaurant.coverImage
        );
      }

      const coverImage =
        await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`
        );

      existingRestaurant.coverImage =
        coverImage;

      await existingRestaurant.save();

      return res.status(200).json({
        message:
          "Cover photo updated successfully",
        data: existingRestaurant,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };

// =========================================
// Update Restaurant Images
// =========================================
export const RestaurantUpdateRestaurantImages =
  async (req, res, next) => {
    try {
      const currentUser = req.user;
      const restaurantImagesFromFE =
        req.files;

      if (
        !restaurantImagesFromFE ||
        restaurantImagesFromFE.length === 0
      ) {
        const error = new Error(
          "At least one restaurant image is required"
        );
        error.statusCode = 400;
        return next(error);
      }

      const existingRestaurant =
        await Restaurant.findOne({
          managerId: currentUser._id,
        });

      if (!existingRestaurant) {
        const error = new Error(
          "Restaurant Not Found"
        );
        error.statusCode = 404;
        return next(error);
      }

      if (
        existingRestaurant.restaurantImage &&
        existingRestaurant.restaurantImage.length > 0
      ) {
        await deleteMultipleImages(
          existingRestaurant.restaurantImage
        );
      }

      const restaurantImages =
        await uploadMultipleImages(
          restaurantImagesFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`
        );

      existingRestaurant.restaurantImage =
        restaurantImages;

      await existingRestaurant.save();

      return res.status(200).json({
        message:
          "Restaurant images updated successfully",
        data: existingRestaurant,
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  };