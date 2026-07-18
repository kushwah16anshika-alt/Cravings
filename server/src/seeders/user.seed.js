import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const UserData = [
  {
    fullname: "Manager1",
    email: "Manager1@gmail.com".toLowerCase(),
    password: await bcrypt.hash("Manager@123", 10),
    dob: "2000-01-01",
    gender: "other",
    userType: "restaurant",
    phone: "9876543210",
    photo: { url: "https://placehold.co/600x400?text=M", publicId: null },
  },
  {
    fullname: "Customer1",
    email: "Customer1@gmail.com".toLowerCase(),
    password: await bcrypt.hash("Customer@123", 10),
    dob: "2000-01-01",
    gender: "other",
    userType: "customer",
    phone: "9876543210",
    photo: { url: "https://placehold.co/600x400?text=C", publicId: null },
  },
  {
    fullname: "Rider1",
    email: "Rider1@gmail.com".toLowerCase(),
    password: await bcrypt.hash("Rider@123", 10),
    dob: "2000-01-01",
    gender: "other",
    userType: "rider",
    phone: "9876543210",
    photo: { url: "https://placehold.co/600x400?text=R", publicId: null },
  },

 
  {
    fullname: "admin1",
    email: "admin1@gmail.com".toLowerCase(),
    password: await bcrypt.hash("Admin@123", 10),
    dob: "2000-01-01",
    gender: "male",
    userType: "admin",
    phone: "9876543210",
    photo: { url: "https://placehold.co/600x400?text=A", publicId: null },
  },
];

const userSeed = async () => {
  try {
    // Seeding Restaurant
    const existingRestaurant = await User.findOne({ email: UserData[0].email });

    if (existingRestaurant) {
      console.log("Existing Resturant Found");
      console.log("Deleting Existing Resturant");
      await existingRestaurant.deleteOne();
    }

    console.log("Creating New Restaurant");
    await User.create(UserData[0]);
    console.log("Restaurant Created Successfully");

    // Seeding Customer
    const existingCustomer = await User.findOne({ email: UserData[1].email });

    if (existingCustomer) {
      console.log("Existing Customer Found");
      console.log("Deleting Existing Customer");
      await existingCustomer.deleteOne();
    }

    console.log("Creating New Customer");
    await User.create(UserData[1]);
    console.log("Customer Created Successfully");

    // Seeding Rider
    const existingRider = await User.findOne({ email: UserData[2].email });

    if (existingRider) {
      console.log("Existing Rider Found");
      console.log("Deleting Existing Rider");
      await existingRider.deleteOne();
    }

    console.log("Creating New Rider");
    await User.create(UserData[2]);
    console.log("Rider Created Successfully");

    // Added from second code - Seeding Admin
    const existingAdmin = await User.findOne({ email: UserData[3].email });

    if (existingAdmin) {
      console.log("Existing Admin Found");
      console.log("Deleting Existing Admin");
      await existingAdmin.deleteOne();
    }

    console.log("Creating New Admin");
    await User.create(UserData[3]);
    console.log("Admin Created Successfully");
  } catch (error) {
    console.log("User Not Created");
    throw error;
  }
};

export default userSeed;