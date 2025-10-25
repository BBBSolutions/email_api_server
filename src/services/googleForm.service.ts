interface GoogleFormData {
  name: string;
  email: string;
  phone: string;
  investmentType: string;
  investmentAmount: string;
  message: string;
}

export const submitToGoogleForm = async (
  data: GoogleFormData
): Promise<void> => {
  try {
    const formUrl = process.env.GOOGLE_FORM_URL;

    // Map form fields to Google Form entry IDs
    const formData = new URLSearchParams();

    formData.append(process.env.GOOGLE_FORM_ENTRY_NAME!, data.name);
    formData.append(process.env.GOOGLE_FORM_ENTRY_EMAIL!, data.email);
    formData.append(process.env.GOOGLE_FORM_ENTRY_PHONE!, data.phone);
    formData.append(process.env.GOOGLE_FORM_ENTRY_INVESTMENT_TYPE!, data.investmentType);
    formData.append(process.env.GOOGLE_FORM_ENTRY_INVESTMENT_AMOUNT!, data.investmentAmount);
    formData.append(process.env.GOOGLE_FORM_ENTRY_MESSAGE!, data.message);

    // Send POST request to Google Form
    const response = await fetch(formUrl!, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(
        "❌ Failed to submit data to Google Form",
        await response.text()
      );
      throw new Error("Google Form submission failed");
    }

    console.log("✅ Data submitted successfully to Google Form");
  } catch (error) {
    console.error("Error submitting to Google Form:", error);
    throw error;
  }
};
