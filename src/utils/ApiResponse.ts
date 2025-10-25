/**
 * @class ApiResponse
 * @description A standardized class for formatting API responses.
 * @template T The expected type of the data payload.
 */
class ApiResponse<T> {
  // Properties must have explicitly defined types
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  /**
   * @param statusCode The HTTP status code of the response (e.g., 200, 201, 400).
   * @param data The actual payload/result data.
   * @param message A descriptive message about the response (defaults to "Success").
   */
  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    // The success flag is automatically determined by the status code
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
