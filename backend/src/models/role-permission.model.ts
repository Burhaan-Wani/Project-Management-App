import mongoose from "mongoose";
import {
    Permissions,
    PermissionType,
    Roles,
    RoleType,
} from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permission";

export interface RoleDocument {
    name: RoleType;
    permissions: Array<PermissionType>;
}

const roleSchema = new mongoose.Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return RolePermissions[this.name];
            },
        },
    },
    {
        timestamps: true,
    }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
