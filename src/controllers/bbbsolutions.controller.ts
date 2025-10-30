import { Request, Response } from "express";
import { sendMail } from "../services/email.service";
import { SmtpCfg } from "../config/mailConfig";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { submitToGoogleForm } from "../services/googleForm.service";

const bbbsolutionsContactController = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message || !phone) {
      throw new ApiError(400, "All fields are required");
    }

    //   Build the HTML template for Site
    const htmlBody = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>`;

    // Get bbbsolutions specific SMTP credentials from .env
    const bbbsolutionsSmtp: SmtpCfg = {
      user: process.env.BBBSOLUTIONS_GMAIL_USER!,
      pass: process.env.BBBSOLUTIONS_GMAIL_PASS!,
      key: "bbbsolutions",
    };

    // Call the generic sendMail service
    await sendMail({
      to: process.env.BBBSOLUTIONS_RECEIVER_EMAIL!,
      from: `"3bsolutions Leads" <${process.env.BBBSOLUTIONS_GMAIL_USER!}>`,
      subject: `New Lead 3bsolutions: ${name}`,
      htmlBody: htmlBody,
      replyTo: email,
      smtpCfg: bbbsolutionsSmtp,
    });

    const bbbsolutinsFieldMappings = {
      [process.env.BBBSOLUTIONS_ENTRY_NAME!]: name,
      [process.env.BBBSOLUTIONS_ENTRY_EMAIL!]: email,
      [process.env.BBBSOLUTIONS_ENTRY_PHONE!]: phone,
      [process.env.BBBSOLUTIONS_ENTRY_MESSAGE!]: message,
    };

    await submitToGoogleForm({
      formUrl: process.env.BBBSOLUTIONS_GOOGLE_FORM_URL!,
      fieldMappings: bbbsolutinsFieldMappings,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        null, // Data is null as no specific payload is returned
        "Email sent successfully!"
      )
    );
  } catch (error) {
    console.error("Error in 3bsolutions contact controller:", error);

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

export { bbbsolutionsContactController };
