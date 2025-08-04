import express from "express";
import passport from "passport";
import config from "../config/app.config";
import {
    googleLoginCallback,
    localLoginController,
    logout,
    me,
    registerUser,
} from "../controllers/auth.controllers";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

const router = express.Router();

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

router.post("/register", registerUser);
router.post("/login", localLoginController);
router.post("/logout", logout);
router.get("/me", isAuthenticated, me);

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
