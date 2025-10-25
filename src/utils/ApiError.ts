/**
 * @class ApiError
 * @description A standardized class for handling and formatting API error responses.
 * It extends the native JavaScript Error class.
 */
class ApiError extends Error {
    // Properties must have explicitly defined types
    public statusCode: number;
    public data: null; // Null is explicitly set for uniformity with ApiResponse structure
    public message: string; // Inherited from Error, but explicitly defined here
    public success: boolean; // Always false for an error
    public errors: string[]; // Array to hold detailed validation or other errors

    /**
     * @param statusCode The HTTP status code of the error (e.g., 400, 401, 500).
     * @param message A user-friendly message describing the error.
     * @param errors An array of strings containing specific validation or detail errors.
     */
    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: string[] = []
    ) {
        // Call the parent (Error) constructor with the message
        super(message); 
        
        // Set the custom properties
        this.statusCode = statusCode;
        this.data = null; 
        this.message = message;
        this.success = false; // By definition, an error is not a success
        this.errors = errors;

        // Ensure proper prototype chaining for custom errors (important in Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}

export { ApiError };