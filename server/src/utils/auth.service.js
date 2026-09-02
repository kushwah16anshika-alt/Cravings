import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

export const getCookieOptions = (maxAgeMs) => ({
  maxAge: maxAgeMs,
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
});

export const genToken = async (user, res) => {
  try {
    const payload = { id: user._id };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("Oreo", token, getCookieOptions(1000 * 60 * 60 * 24));

    return token;
  } catch (error) {
    console.log("genToken error:", error.message);
    throw error;
  }
};

export const genOTPToken = async (user, res) => {
  try {
    const payload = { id: user._id };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("kitkat", token, getCookieOptions(1000 * 60 * 10));

    return token;
  } catch (error) {
    console.log("genOTPToken error:", error.message);
    throw error;
  }
};