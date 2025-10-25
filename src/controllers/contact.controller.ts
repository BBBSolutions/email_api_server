import { Request, Response } from "express";
import { sendMail } from "../services/email.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { submitToGoogleForm } from "../services/googleForm.service";

const contactController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      investmentType,
      investmentAmount,
      message,
    } = req.body;

    console.log("Request is coming in backend")

    if (!name || !email || !message || !phone || !investmentType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Call the sendMail function
    await sendMail({
      name,
      email,
      phone,
      investmentType,
      investmentAmount,
      message,
    });

     // Step 2️⃣: Submit data to Google Form
    await submitToGoogleForm({
      name,
      email,
      phone,
      investmentType,
      investmentAmount,
      message,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        null, // Data is null as no specific payload is returned
        "Email sent successfully!"
      )
    );
  } catch (error) {
    console.error("Email sending error:", error);

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

export { contactController };
