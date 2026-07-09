import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";

export const EditUserProfile = async (req, res, next) => {
  try {
    const { email, fullname, phone } = req.body;
    const newPhoto = req.file;

    console.log("Req Body :", req.body);
    console.log("Req File :", req.file);

    if (!email || !fullname || !phone) {
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

    if (newPhoto) {
      const b64 = Buffer.from(newPhoto.buffer).toString("base64");
      const dataURI = `data:${newPhoto.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "Cravingss/user",
        width: 500,
        height: 500,
        crop: "fill",
      });

      console.log(result);
      existingUser.photo.url = result.secure_url;
      existingUser.photo.publicId = result.public_id;
    }

    existingUser.fullname = fullname;
    existingUser.phone = phone;

    await existingUser.save();

    res
      .status(200)
      .json({ message: "User Updated Sucessfully", data: existingUser });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
