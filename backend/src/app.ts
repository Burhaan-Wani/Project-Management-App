import express from "express";
import cors from "cors";
import session from "cookie-session";

import passport from "passport";
import config from "./config/app.config";
import errorHandlingMiddleware from "./middlewares/errorHandler.middleware";

import "./config/passport.config";

import authRoutes from "./routes/auth.routes";

const app = express();
const BASE_PATH = config.BASE_PATH;

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [config.FRONTEND_URL],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
);

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    if (req.session && !req.session.regenerate) {
        (req.session as Record<string, any>).regenerate = (cb: Function) =>
            cb();
    }
    if (req.session && !req.session.save) {
        (req.session as Record<string, any>).save = (cb: Function) => cb();
    }
    next();
});

// ROUTES
app.use(`${BASE_PATH}/auth`, authRoutes);

// ERROR HANDLING MIDDLEWARE
app.use(errorHandlingMiddleware);

export default app;
