import { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler.middleware";
import { UserDocument } from "../models/user.model";
import { AppError } from "../utils/AppError";

export const isAuthenticated = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as UserDocument;
        if (!user || !user._id) {
            return next(
                new AppError("You are not logged in. Please login first.", 401)
            );
        }
        next();
    }
);
