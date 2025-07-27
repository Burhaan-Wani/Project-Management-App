import mongoose, { Schema, Types } from "mongoose";
import { RoleDocument } from "./role-permission.model";

export interface MemberDocument {
    userId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    role: RoleDocument; // TODO: Change type from RoleDocument to ObjectId if it doesn't work
    joinedAt?: Date;
}

const memberSchema = new mongoose.Schema<MemberDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Member = mongoose.model<MemberDocument>("Member", memberSchema);

export default Member;
