import { ApiError } from "../utils/ApiError";

export interface GoogleFormData {
  formUrl: string;
  // A simple key-value map where the key is the Google Form Entry ID
  // e.g., { "entry.123456": "Aditya", "entry.789012": "test@email.com" }
  fieldMappings: Record<string, string>;
}

export const submitToGoogleForm = async (
  data: GoogleFormData
): Promise<void> => {
  const { formUrl, fieldMappings } = data;

  if (!formUrl) {
    throw new ApiError(500, "Google form URL is not defined in .env");
  }

  try {
    const formData = new URLSearchParams();

    for (const entryId in fieldMappings) {
      formData.append(entryId, fieldMappings[entryId]);
    }

    const response = await fetch(formUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error(
        "❌ Failed to submit data to Google Form",
        await response.text()
      );
      throw new ApiError(500, "Google Form submission failed");
    }

    console.log("✅ Data submitted successfully to Google Form");
  } catch (error) {
    console.error("Error submitting to Google Form:", error);
    throw error;
  }
};
