import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import config from "../config/app.config";
import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config";

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
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};

const handleZodError = (error: ZodError, res: Response) => {
    const errors = error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
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
    } else {
        console.log(
            "NODE_ENV variable not set properly. Falling back to normal error response."
        );
        res.status(error.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            status: error.status || "error",
            message: error.message || "Something went wrong",
        });
    }
};

export default errorHandlingMiddleware;
