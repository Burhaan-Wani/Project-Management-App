import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "3002"),
  SESSION_SECRET:getEnv("SESSION_SECRET"),
  BASE_PATH: getEnv("BASE_PATH", "/api/v1"),
  MONGO_DB_URI: getEnv("MONGO_DB_URI"),
  FRONTEND_ORIGIN:getEnv("FRONTEND_ORIGIN")
});

const config = appConfig();

export default config;
