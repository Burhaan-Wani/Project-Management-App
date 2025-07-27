import mongoose, { Schema, Types } from "mongoose";
import { generateInviteCode } from "../utils/uuid";

interface IWorkspace {
    name: string;
    description?: string;
    owner: Types.ObjectId;
    inviteCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface WorkspaceMethods {
    resetInviteCode(): void;
}

export interface WorkspaceDocument extends IWorkspace, WorkspaceMethods {}

const workspaceSchema = new mongoose.Schema<WorkspaceDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inviteCode: {
            type: String,
            default: generateInviteCode,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

workspaceSchema.methods.resetInviteCode = function () {
    this.inviteCode = generateInviteCode();
};

const Workspace = mongoose.model<WorkspaceDocument>(
    "Workspace",
    workspaceSchema
);

export default Workspace;
