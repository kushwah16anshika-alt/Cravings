import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async (to, subject, message) => {
  try {
    console.log("Started Sending Email");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSCODE,
      },
    });

    console.log("Transporter created successfully");

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to,
      subject,
      html: message,
    };

    const response = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
    console.log(response);

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
