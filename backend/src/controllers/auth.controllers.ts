import { NextFunction, Response, Request } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import config from "../config/app.config";
import { UserDocument } from "../models/user.model";

// declare module "express-serve-static-core" {
//     interface Request {
//         user?: UserDocument;
//     }
// }
export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            );
        }
        const currentWorkspaceId = req.user.currentWorkspace;

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
