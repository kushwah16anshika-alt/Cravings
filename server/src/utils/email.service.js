import sendEmail from "../config/email.config.js";

export const sendOTPEmail = async (
  email,
  newOTP,
  fullname = "User",
) => {
  try {
    const subject = "Cravings - Secure OTP Verification";

    const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #eee; padding:20px; background:#fff;">
      
      <div style="text-align:center; margin-bottom:20px;">
        <img
          src="https://res.cloudinary.com/dpl3xwf1z/image/upload/v1783776802/circleLogo_z7icie.png"
          alt="Cravings Logo"
          width="80"
          style="margin-bottom:10px;"
        />

        <h2 style="color:#ff6600; margin-top:10px;">
          OTP Verification
        </h2>
      </div>

      <p style="font-size:16px; color:#333;">
        Hello <strong>${fullname}</strong>,
      </p>

      <p style="font-size:15px; color:#555;">
        Thank you for choosing <b>Cravings Food Delivery</b>.
        To keep your account secure, please use the following
        One-Time Password:
      </p>

      <div style="text-align:center; margin:20px 0;">
        <span style="
          font-size:28px;
          font-weight:bold;
          color:#ff6600;
          letter-spacing:5px;
          border:2px dashed #ff6600;
          padding:12px 20px;
          display:inline-block;
          border-radius:8px;
        ">
          ${newOTP}
        </span>
      </div>

      <p style="font-size:14px; color:#555;">
        This OTP will expire in <b>10 minutes</b>.
      </p>

      <p style="font-size:14px; color:#555;">
        If you did not request this OTP,
        simply ignore this email.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a
          href="https://cravings.ricr.in"
          style="
            background:#ff6600;
            color:#fff;
            padding:12px 25px;
            text-decoration:none;
            border-radius:5px;
            font-weight:bold;
          "
        >
          Visit Cravings
        </a>
      </div>

      <p style="margin-top:30px; font-size:14px; color:#777;">
        Stay hungry, stay happy!<br>
        — Cravings Team
      </p>

    </div>
    `;

    await sendEmail(email, subject, message);

    console.log("OTP email sent successfully!");
  } catch (error) {
    console.log("OTP Email Error:", error.message);
    throw error;
  }
};