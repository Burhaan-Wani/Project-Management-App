import mongoose, { Schema, Types } from "mongoose";

export interface ProjectDocument {
    name: string;
    description?: string;
    emoji?: string;
    workspaceId: Types.ObjectId;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new mongoose.Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        emoji: {
            type: String,
            trim: true,
            default: "📊",
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model<ProjectDocument>("Project", projectSchema);

export default Project;
