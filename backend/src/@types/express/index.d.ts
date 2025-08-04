import {} from "../../models/user.model";

export {};

declare global {
    namespace Express {
        interface User extends UserDocument {}
        interface Request {
            user?: User;
        }
    }
}
