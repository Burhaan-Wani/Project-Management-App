import { getEnv } from "../utils/get-env";

const appConfig = () => ({
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: getEnv("PORT", "3002"),
    SESSION_SECRET: getEnv("SESSION_SECRET"),
    BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
    MONGO_DB_URI: getEnv("MONGO_DB_URI"),
    FRONTEND_URL: getEnv("FRONTEND_URL"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
});

const config = appConfig();

export default config;
