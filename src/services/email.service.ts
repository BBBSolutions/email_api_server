import nodemailer from "nodemailer";
import { transporter } from "../config/mailConfig";

// Define the email content structure
interface MailOptions {
  name: string;
  email: string;
  phone: string; // string is better for phone numbers
  investmentType: string;
  investmentAmount?: string;
  message: string;
}

// Sends an email with form details
export const sendMail = async (data: MailOptions): Promise<void> => {
  try {
    // Structure the email content
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"FundStar Website" <${process.env.GMAIL_USER}>`, // your verified Gmail
      to: process.env.RECEIVER_EMAIL, // receiver email
      replyTo: data.email, // user's email (so you can reply directly)
      subject: "New Contact Form Submission from FundStar Website", // default subject
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone Number:</strong> ${data.phone}</p>
        <p><strong>investmentType:</strong> ${data.investmentType}</p>
        ${
          data.investmentAmount
            ? `<p><strong>Investment Amount:</strong> ${data.investmentAmount}</p>`
            : ""
        }
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Email sending failed");
  }
};
