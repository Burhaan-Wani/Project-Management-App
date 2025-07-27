import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import config from "../config/app.config";
import { ZodError } from "zod";

const handleDevError = (error: AppError, res: Response) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

const handleProdError = (error: AppError, res: Response) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.log("Error: ", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleZodError = (error: ZodError, res: Response) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(400).json({
    status: "fail",
    errors: errors,
  });
};

const errorHandlingMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (error instanceof ZodError) {
    return handleZodError(error, res);
  }

  if (config.NODE_ENV === "development") {
    handleDevError(error, res);
  } else if (config.NODE_ENV === "production") {
    handleProdError(error, res);
  }
};

export default errorHandlingMiddleware;
