import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import config from "./app.config";
import { AppError } from "../utils/AppError";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
    loginOrGoogleAccountService,
    loginService,
} from "../services/auth.services";
import User, { UserDocument } from "../models/user.model";

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;
                if (!googleId) {
                    throw new AppError("Google ID (sub) is missing", 404);
                }
                const { user } = await loginOrGoogleAccountService({
                    provider: ProviderEnum.GOOGLE,
                    providerId: googleId,
                    email: email as string,
                    picture,
                    displayName: profile.displayName,
                });
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: true,
        },
        async (email, password, done) => {
            try {
                const user = await loginService({ email, password });
                return done(null, user);
            } catch (error: any) {
                return done(error, false, { message: error?.message });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, (user as UserDocument)._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});
