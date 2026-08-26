import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import cloudinary from "../config/cloudinary.config.js";
import bcrypt from "bcrypt";

export const EditUserProfile = async (req, res, next) => {
  try {
    const rawFullName = req.body.fullName || req.body.fullname;
    const rawEmail = req.body.email;
    const { phone, dob, gender, address, city, state, pincode } = req.body;
    const newPhoto = req.file;

    const currentUser = req.user;
    const email = (rawEmail || currentUser.email).toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("User not registered");
      error.statusCode = 404;
      return next(error);
    }

    // Update profile photo
    if (newPhoto) {
      if (existingUser?.photo?.publicId) {
        await cloudinary.uploader.destroy(existingUser.photo.publicId);
      }

      const b64 = Buffer.from(newPhoto.buffer).toString("base64");
      const dataURI = `data:${newPhoto.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "Cravings678/profile",
        width: 500,
        height: 500,
        crop: "fill",
      });

      if (!existingUser.photo) {
        existingUser.photo = {};
      }

      existingUser.photo.url = result.secure_url;
      existingUser.photo.publicId = result.public_id;
    }

    // Update basic information
    if (rawFullName) {
      existingUser.fullname = rawFullName.trim();
    }
    if (phone) {
      existingUser.phone = phone;
    }

    // Update optional information
    if (dob) existingUser.dob = dob;
    if (gender) existingUser.gender = gender;
    if (address) existingUser.address = address;
    if (city) existingUser.city = city;
    if (state) existingUser.state = state;
    if (pincode) existingUser.pincode = pincode;

    await existingUser.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      data: existingUser,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const UpdateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const currentUser = req.user;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      currentUser.password
    );

    if (!isPasswordMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashedPassword;
    currentUser.lastPasswordChange = new Date();

    await currentUser.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// ===============================
// ADDRESS BOOK (CUSTOMER)
// ===============================
export const GetAddressBook = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let customer = await Customer.findOne({ customerId: userId });

    if (!customer) {
      customer = await Customer.create({
        customerId: userId,
        addressBook: [],
      });
    }

    return res.status(200).json({
      message: "Address book fetched successfully",
      data: customer.addressBook || [],
    });
  } catch (error) {
    console.error("GetAddressBook Error:", error);
    next(error);
  }
};

export const AddAddress = async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pinCode,
      pincode,
      country,
      addressType,
      isDefault,
      geoLat,
      geoLon,
    } = req.body;

    if (!address || !city || !state || !(pinCode || pincode)) {
      const error = new Error("All required address fields must be provided");
      error.statusCode = 400;
      return next(error);
    }

    const userId = req.user._id;
    let customer = await Customer.findOne({ customerId: userId });

    if (!customer) {
      customer = await Customer.create({
        customerId: userId,
        addressBook: [],
      });
    }

    const isFirst = (customer.addressBook?.length || 0) === 0;

    if (isDefault) {
      customer.addressBook.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    customer.addressBook.push({
      name: name || req.user.fullname || "My Address",
      address,
      city,
      state,
      pinCode: pinCode || pincode,
      country: country || "India",
      addressType: addressType || "home",
      isDefault: isDefault !== undefined ? isDefault : isFirst,
      geoLocation: {
        lat: geoLat ? String(geoLat) : "",
        lon: geoLon ? String(geoLon) : "",
      },
    });

    await customer.save();

    return res.status(200).json({
      message: "Address added successfully",
      data: customer.addressBook,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const UpdateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const {
      name,
      address,
      city,
      state,
      pinCode,
      pincode,
      country,
      addressType,
      isDefault,
      geoLat,
      geoLon,
    } = req.body;

    const userId = req.user._id;
    let customer = await Customer.findOne({ customerId: userId });

    if (!customer) {
      const error = new Error("Customer profile not found");
      error.statusCode = 404;
      return next(error);
    }

    const targetAddress = customer.addressBook.id(addressId);

    if (!targetAddress) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    if (isDefault) {
      customer.addressBook.forEach((addr) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    if (name !== undefined) targetAddress.name = name;
    if (address !== undefined) targetAddress.address = address;
    if (city !== undefined) targetAddress.city = city;
    if (state !== undefined) targetAddress.state = state;
    if (pinCode !== undefined || pincode !== undefined) {
      targetAddress.pinCode = pinCode || pincode;
    }
    if (country !== undefined) targetAddress.country = country;
    if (addressType !== undefined) targetAddress.addressType = addressType;
    if (isDefault !== undefined) targetAddress.isDefault = isDefault;

    if (geoLat !== undefined || geoLon !== undefined) {
      targetAddress.geoLocation = {
        lat: geoLat !== undefined ? String(geoLat) : targetAddress.geoLocation?.lat || "",
        lon: geoLon !== undefined ? String(geoLon) : targetAddress.geoLocation?.lon || "",
      };
    }

    await customer.save();

    return res.status(200).json({
      message: "Address updated successfully",
      data: customer.addressBook,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const DeleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    let customer = await Customer.findOne({ customerId: userId });

    if (!customer) {
      const error = new Error("Customer profile not found");
      error.statusCode = 404;
      return next(error);
    }

    customer.addressBook = customer.addressBook.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await customer.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      data: customer.addressBook,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// ===============================
// GET ALL ORDERS OF CURRENT USER
// ===============================
export const GetAllOrders = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const customer = await Customer.findOne({ customerId: currentUser._id });
    const customerIds = [currentUser._id];
    if (customer?._id) {
      customerIds.push(customer._id);
    }

    const orders = await Order.find({
      customerId: { $in: customerIds },
    })
      .populate("restaurantId", "restaurantName coverImage address city averageRating")
      .populate("orderItems.itemId", "itemName price image category foodType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};