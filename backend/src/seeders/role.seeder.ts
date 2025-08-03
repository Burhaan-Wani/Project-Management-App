import path from "path";
import dotenv from "dotenv";
dotenv.config({
    path: path.join(__dirname, "../../..", "config.env"),
});

import mongoose from "mongoose";
import Role from "../models/role-permission.model";

import { RolePermissions } from "../utils/role-permission";
import connectDatabase from "../config/database.config";

const seedRoles = async function () {
    console.log("Seeding roles started...");

    try {
        await connectDatabase();

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await Role.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];

            const existingRole = await Role.findOne({ name: role }).session(
                session
            );

            if (!existingRole) {
                const newRole = Role.create(
                    [
                        {
                            name: role,
                            permissions,
                        },
                    ],
                    { session }
                );
                console.log(`Role ${role} added with permissions.`);
            } else {
                console.log(`Role ${role} already exists`);
            }
        }

        await session.commitTransaction();
        console.log("Transaction committed");

        session.endSession();
        console.log("Session ended");

        console.log("Seeding completed successfully");
    } catch (error) {
        console.log("Error during seeding", error);
    }
};

seedRoles().catch(error =>
    console.log("Error while running seeding script", error)
);
