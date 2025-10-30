import { Request, Response } from "express";
import { sendMail } from "../services/email.service";
import { SmtpCfg } from "../config/mailConfig";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { submitToGoogleForm } from "../services/googleForm.service";

const fundstarContactController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, investmentType, investmentAmount, message } =
      req.body;

    if (!name || !email || !message || !phone || !investmentType) {
      throw new ApiError(400, "All fields are required");
    }

    //   Build the HTML template for Site
    const htmlBody = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>investmentType:</strong> ${investmentType}</p>
        ${
          investmentAmount
            ? `<p><strong>Investment Amount:</strong> ${investmentAmount}</p>`
            : ""
        }
        <p><strong>Message:</strong></p>
        <p>${message}</p>`;

    // Get fundstar specific SMTP credentials from .env
    const fundstarSmtp: SmtpCfg = {
      user: process.env.FUNDSTAR_GMAIL_USER!,
      pass: process.env.FUNDSTAR_GMAIL_PASS!,
      key: "fundstar",
    };

    // Call the generic sendMail service
    await sendMail({
      to: process.env.FUNDSTAR_RECEIVER_EMAIL!,
      from: `"Fundstar Leads" <${process.env.FUNDSTAR_GMAIL_USER!}>`,
      subject: `New Lead: ${name} (${investmentType})`,
      htmlBody: htmlBody,
      replyTo: email,
      smtpCfg: fundstarSmtp,
    });

    const fundstarFieldMappings = {
      [process.env.FUNDSTAR_ENTRY_NAME!]: name,
      [process.env.FUNDSTAR_ENTRY_EMAIL!]: email,
      [process.env.FUNDSTAR_ENTRY_PHONE!]: phone,
      [process.env.FUNDSTAR_ENTRY_INVESTMENT_TYPE!]: investmentType,
      [process.env.FUNDSTAR_ENTRY_INVESTMENT_AMOUNT!]: investmentAmount || "", // Use empty string if optional
      [process.env.FUNDSTAR_ENTRY_MESSAGE!]: message,
    };

    await submitToGoogleForm({
      formUrl: process.env.FUNDSTAR_GOOGLE_FORM_URL!,
      fieldMappings: fundstarFieldMappings,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        null, // Data is null as no specific payload is returned
        "Email sent successfully!"
      )
    );
  } catch (error) {
    console.error("Error in fundstar contact controller:", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
      });
    }

    // fallback for unexpected errors
    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred while sending the email.",
    });
  }
};

export { fundstarContactController };
