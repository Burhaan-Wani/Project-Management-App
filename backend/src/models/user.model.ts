import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: Types.ObjectId | null;
}
interface UserMethods {
    comparePassowords(password: string): Promise<boolean>;
    omitPassword(): Omit<IUser, "password">;
}
export interface UserDocument extends IUser, UserMethods {}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
        },
        profilePicture: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        currentWorkspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password as string, 12);
});

userSchema.methods.comparePassowords = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.omitPassword = function (): Omit<IUser, "password"> {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
