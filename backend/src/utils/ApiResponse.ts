class ApiResponse {
  statusCode: number;
  data: object;
  message: string;
  success: boolean;
  constructor(statusCode: number, data: object, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
    Object.setPrototypeOf(this, ApiResponse.prototype);
  }
}

export default ApiResponse;
