import mongoose, { Schema } from "mongoose";
import { ProviderEnumType } from "../enums/account-provider.enum";
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
                        description: `Welcome to your workspace ${user.name}`,
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
