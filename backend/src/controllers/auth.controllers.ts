import { NextFunction, Response, Request } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import config from "../config/app.config";
import { UserDocument } from "../models/user.model";
import z from "zod";
import { registerSchema } from "../validations/auth.validations";
import { registerAccountService } from "../services/auth.services";
import { AppError } from "../utils/AppError";
import { HTTPSTATUS } from "../config/http.config";
import passport from "passport";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as UserDocument | undefined;
        if (!user) {
            return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            );
        }
        const currentWorkspaceId = user.currentWorkspace;

        if (!currentWorkspaceId) {
            console.log("Redirecting because currentWorkspaceId is falsy.");
            return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            );
        }

        return res.redirect(
            `${config.FRONTEND_URL}/workspace/${currentWorkspaceId.toString()}`
        );
    }
);

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { success, data, error } = registerSchema.safeParse({
            ...req.body,
        });
        if (!success) {
            const err = error.issues.map(error => ({
                field: error.path.join("."),
                message: error.message,
            }));
            return next(new AppError(JSON.stringify(err), 400));
        }

        await registerAccountService(data);

        res.status(HTTPSTATUS.CREATED).json({
            status: "success",
            message: "User created successfully",
        });
    }
);

export const localLoginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "local",
            function (
                err: Error | null,
                user: Express.User | false,
                info: { message: string } | undefined
            ) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                        status: "fail",
                        message: info?.message || "Invalid email or password",
                    });
                }
                req.logIn(user, err => {
                    if (err) {
                        return next(err);
                    }
                    return res.status(HTTPSTATUS.OK).json({
                        status: "success",
                        message: "Logged in successfully",
                        user,
                    });
                });
            }
        )(req, res, next);
    }
);
