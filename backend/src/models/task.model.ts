import mongoose, { Schema, Types } from "mongoose";
import {
    TaskPriorityEnum,
    TaskPriorityEnumType,
    TaskStatusEnum,
    TaskStatusEnumType,
} from "../enums/task.enum";
import { generateTaskCode } from "../utils/uuid";

export interface TaskDocument {
    taskCode: string;
    title: string;
    description?: string;
    projectId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    createdBy: Types.ObjectId;
    assignedTo: Types.ObjectId | null;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>(
    {
        taskCode: {
            type: String,
            unique: true,
            default: generateTaskCode,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
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
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriorityEnum),
            default: TaskPriorityEnum.MEDIUM,
        },
        status: {
            type: String,
            enum: Object.values(TaskStatusEnum),
            default: TaskStatusEnum.TODO,
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;
