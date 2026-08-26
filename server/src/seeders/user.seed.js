import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getSeedUsers = async () => [
  {
    fullname: "Restaurant Manager",
    email: "manager1@gmail.com",
    password: await bcrypt.hash("Manager@123", 10),
    dob: new Date("1995-01-01"),
    gender: "male",
    userType: "restaurant",
    phone: "9876543210",
    photo: { url: "https://placehold.co/600x400?text=RM", publicId: null },
  },
  {
    fullname: "Regular Customer",
    email: "customer1@gmail.com",
    password: await bcrypt.hash("Customer@123", 10),
    dob: new Date("1998-05-15"),
    gender: "female",
    userType: "user",
    phone: "9876543211",
    photo: { url: "https://placehold.co/600x400?text=RC", publicId: null },
  },
  {
    fullname: "Delivery Rider",
    email: "rider1@gmail.com",
    password: await bcrypt.hash("Rider@123", 10),
    dob: new Date("1999-08-20"),
    gender: "male",
    userType: "rider",
    phone: "9876543212",
    photo: { url: "https://placehold.co/600x400?text=DR", publicId: null },
  },
  {
    fullname: "Site Admin",
    email: "admin1@gmail.com",
    password: await bcrypt.hash("Admin@123", 10),
    dob: new Date("1990-10-10"),
    gender: "male",
    userType: "admin",
    phone: "9876543213",
    photo: { url: "https://placehold.co/600x400?text=SA", publicId: null },
  },
];

const userSeed = async () => {
  try {
    const users = await getSeedUsers();

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        await existing.deleteOne();
      }
      await User.create(userData);
    }

    console.log("All Seed Users Created Successfully");
  } catch (error) {
    console.error("userSeed error:", error.message);
    throw error;
  }
};

export default userSeed;