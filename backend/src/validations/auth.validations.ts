import { z } from "zod";

const emailSchema = z.email().min(1).max(255);
const name = z.string().trim().min(1).max(255);
const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
    name,
    email: emailSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});
