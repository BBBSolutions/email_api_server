import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Step 1️⃣: Create and configure the transporter(we are creating a connection to the email service)
export const transporter = nodemailer.createTransport({
  service: "gmail", // using gmail as a service
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Step 2️⃣: Verify the transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service connection failed: ", error);
  } else {
    console.log("Email service is ready to send messages: ", success);
  }
});
