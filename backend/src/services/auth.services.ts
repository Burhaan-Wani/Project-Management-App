import mongoose, { Types } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enum";
import User from "../models/user.model";
import Account from "../models/account.model";
import Workspace from "../models/workspace.model";
import Role from "../models/role-permission.model";
import { Roles } from "../enums/role.enum";
import { AppError } from "../utils/AppError";
import Member from "../models/member.model";
import { HTTPSTATUS } from "../config/http.config";

interface LoginData {
    provider: ProviderEnumType;
    providerId: string;
    displayName: string;
    email: string;
    picture?: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LocalLoginData {
    email: string;
    password: string;
}
export const loginOrGoogleAccountService = async function (data: LoginData) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        let user = await User.findOne({ email: data.email }).session(session);

        if (!user) {
            [user] = await User.create(
                [
                    {
                        name: data.displayName,
                        email: data.email,
                        profilePicture: data.picture || null,
                    },
                ],
                { session }
            );
            if (!user) {
                throw new AppError(
                    "Failed to create user.",
                    HTTPSTATUS.INTERNAL_SERVER_ERROR
                );
            }

            await Account.create(
                [
                    {
                        provider: data.provider,
                        providerId: data.providerId,
                        userId: user._id,
                    },
                ],
                { session }
            );

            const [workspace] = await Workspace.create(
                [
                    {
                        name: "My-Workspace",
                        description: `Welcome to ${user.name} workspace.`,
                        owner: user._id,
                    },
                ],
                { session }
            );

            const ownerRole = await Role.findOne({
                name: Roles.OWNER,
            }).session(session);

            if (!ownerRole) {
                throw new AppError("Owner role not found.", 404);
            }

            await Member.create(
                [
                    {
                        workspaceId: workspace._id,
                        userId: user._id,
                        role: ownerRole._id,
                        joinedAt: new Date(),
                    },
                ],
                { session }
            );

            user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
            await user.save({ session });
            // assign role
        }
        await session.commitTransaction();
        return { user };
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const registerAccountService = async function (data: RegisterData) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const existsUser = await User.findOne({ email: data.email }).session(
            session
        );
        if (existsUser) {
            throw new AppError("User with this email already exists", 400);
        }

        let [user] = await User.create(
            [
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profilePicture: null,
                },
            ],
            { session }
        );
        if (!user) {
            throw new AppError("Failed to register user", 500);
        }

        await Account.create(
            [
                {
                    userId: user._id,
                    provider: ProviderEnum.EMAIL,
                    providerId: user.email,
                },
            ],
            { session }
        );

        const [workspace] = await Workspace.create(
            [
                {
                    name: "My-Workspace",
                    description: `Welcome to ${user.name} workspace.`,
                    owner: user._id,
                },
            ],
            { session }
        );

        const role = await Role.findOne({ name: Roles.OWNER }).session(session);

        if (!role) {
            throw new AppError("OWNER role not found", 404);
        }

        await Member.create(
            [
                {
                    userId: user._id,
                    workspaceId: workspace._id,
                    role: role._id,
                },
            ],
            { session }
        );

        user.currentWorkspace = workspace._id;
        await user.save({ session });

        session.commitTransaction();
        return { userId: user._id, workspaceId: workspace._id };
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const loginService = async function (data: LocalLoginData) {
    try {
        const account = await Account.findOne({
            provider: ProviderEnum.EMAIL,
            providerId: data.email,
        });
        if (!account) {
            throw new AppError("User not found for the given account", 404);
        }

        const user = await User.findOne({ email: data.email });
        if (!user || !(await user.comparePassowords(data.password))) {
            throw new AppError("Email or password is incorrect", 400);
        }

        return user.omitPassword();
    } catch (error) {
        throw error;
    }
};

export const getMeService = async function (userId: Types.ObjectId) {
    const user = await User.findById(userId)
        .populate("currentWorkspace")
        .select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { user };
};
