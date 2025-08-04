import express from "express";
import passport from "passport";
import config from "../config/app.config";
import { googleLoginCallback } from "../controllers/auth.controllers";

const router = express.Router();

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedUrl,
        session: true,
    }),
    googleLoginCallback
);
export default router;
