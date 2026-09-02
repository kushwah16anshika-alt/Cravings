import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const getSeedUsers = async () => {
  const defaultPassword = await bcrypt.hash("Password@123", 10);
  const managerPassword = await bcrypt.hash("Manager@123", 10);

  return [
    // Restaurant Managers
    {
      fullname: "Marco Rossi (Bella Napoli)",
      email: "manager1@gmail.com",
      password: managerPassword,
      dob: new Date("1991-03-12"),
      gender: "male",
      userType: "restaurant",
      phone: "9876543201",
      photo: { url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Jake Miller (Burger Barn)",
      email: "manager2@gmail.com",
      password: managerPassword,
      dob: new Date("1993-07-22"),
      gender: "male",
      userType: "restaurant",
      phone: "9876543202",
      photo: { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Nawabzada Farhan (Royal Biryani)",
      email: "manager3@gmail.com",
      password: managerPassword,
      dob: new Date("1989-11-05"),
      gender: "male",
      userType: "restaurant",
      phone: "9876543203",
      photo: { url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Kenji Tanaka (Wok & Roll)",
      email: "manager4@gmail.com",
      password: managerPassword,
      dob: new Date("1992-09-18"),
      gender: "male",
      userType: "restaurant",
      phone: "9876543204",
      photo: { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Maya Lin (Green Bowl Organics)",
      email: "manager5@gmail.com",
      password: managerPassword,
      dob: new Date("1995-04-14"),
      gender: "female",
      userType: "restaurant",
      phone: "9876543205",
      photo: { url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Sarah Jenkins (Bean & Bloom)",
      email: "manager6@gmail.com",
      password: managerPassword,
      dob: new Date("1994-08-30"),
      gender: "female",
      userType: "restaurant",
      phone: "9876543206",
      photo: { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Anand Swaminathan (Madras Tiffin)",
      email: "manager7@gmail.com",
      password: managerPassword,
      dob: new Date("1988-12-10"),
      gender: "male",
      userType: "restaurant",
      phone: "9876543207",
      photo: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Leo Zhang (Sip & Slurp Boba)",
      email: "manager8@gmail.com",
      password: managerPassword,
      dob: new Date("1996-06-25"),
      gender: "male",
      userType: "restaurant",
      phone: "9876543208",
      photo: { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", publicId: null },
    },

    // Regular Customers
    {
      fullname: "Aarav Sharma",
      email: "customer1@gmail.com",
      password: defaultPassword,
      dob: new Date("2002-05-15"),
      gender: "male",
      userType: "user",
      phone: "9876543211",
      photo: { url: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav", publicId: null },
    },
    {
      fullname: "Priya Nair",
      email: "customer2@gmail.com",
      password: defaultPassword,
      dob: new Date("2003-09-20"),
      gender: "female",
      userType: "user",
      phone: "9876543214",
      photo: { url: "https://api.dicebear.com/7.x/bottts/svg?seed=Priya", publicId: null },
    },

    // Delivery Riders
    {
      fullname: "Vikram Singh",
      email: "rider1@gmail.com",
      password: defaultPassword,
      dob: new Date("1999-08-20"),
      gender: "male",
      userType: "rider",
      phone: "9876543212",
      photo: { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", publicId: null },
    },
    {
      fullname: "Amit Patel",
      email: "rider2@gmail.com",
      password: defaultPassword,
      dob: new Date("2000-02-14"),
      gender: "male",
      userType: "rider",
      phone: "9876543215",
      photo: { url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80", publicId: null },
    },

    // Site Admin
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
};

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

    console.log("✅ All Seed Users Created Successfully");
  } catch (error) {
    console.error("userSeed error:", error.message);
    throw error;
  }
};

export default userSeed;