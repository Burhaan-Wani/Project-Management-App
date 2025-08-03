import path from "path";
import dotenv from "dotenv";
dotenv.config({
    path: path.join(__dirname, "../..", "config.env"),
});
import app from "./app";
import config from "./config/app.config";
import connectDatabase from "./config/database.config";

const SERVER_PORT = config.PORT;
connectDatabase()
    .then(() => {
        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on http://localhost:${SERVER_PORT}`);
        });
    })
    .catch(() => {
        console.log("Error while connecting to DB");
        process.exit(1);
    });
