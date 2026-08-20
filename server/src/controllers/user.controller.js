import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";
import bcrypt from "bcrypt";

export const EditUserProfile = async (req, res, next) => {
  try {
    const {
      email,
      fullName,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const newPhoto = req.file;

    console.log("Req Body :", req.body);
    console.log("Req File :", req.file);

    if (!email || !fullName || !phone) {
      const error = new Error("All fields Required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("Email not registred");
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

      console.log(result);

      if (!existingUser.photo) {
        existingUser.photo = {};
      }

      existingUser.photo.url = result.secure_url;
      existingUser.photo.publicId = result.public_id;
    }

    // Update basic information
    existingUser.fullName = fullName;
    existingUser.phone = phone;

    // Update optional information
    if (dob) existingUser.dob = dob;
    if (gender) existingUser.gender = gender;
    if (address) existingUser.address = address;
    if (city) existingUser.city = city;
    if (state) existingUser.state = state;
    if (pincode) existingUser.pincode = pincode;

    await existingUser.save();

    return res.status(200).json({
      message: "User Updated Sucessfully",
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

    // User Already Verified By Auth Protect Middleware
    const currentUser = req.user;

    // Check old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      currentUser.password,
    );

    if (!isPasswordMatch) {
      const error = new Error("Old password is incorrect");
      error.statusCode = 400;
      return next(error);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    currentUser.password = hashedPassword;

    // Save password
    await currentUser.save();

    // Delay for 3 seconds before sending response
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};