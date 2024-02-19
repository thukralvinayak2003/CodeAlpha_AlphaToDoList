class AppError extends Error {
  isOperation: boolean;
  status: string;
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperation = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
