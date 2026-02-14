import { z } from 'zod';

export const loginSchema = z.object({
    user_json_url: z.string().url({ message: "Invalid user JSON URL" }).refine((url) => {
        try {
            const parsedUrl = new URL(url);
            return (
                parsedUrl.protocol === 'https:' &&
                (parsedUrl.hostname === 'phone.email' ||
                    parsedUrl.hostname.endsWith('.phone.email') ||
                    parsedUrl.hostname === 'www.phone.email')
            );
        } catch {
            return false;
        }
    }, { message: "URL must be from phone.email domain" }),
});

export const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
    location: z.string().min(2, { message: "Location must be at least 2 characters long" }),
    user_json_url: z.string().url({ message: "Invalid user JSON URL" }).refine((url) => {
        try {
            const parsedUrl = new URL(url);
            return (
                parsedUrl.protocol === 'https:' &&
                (parsedUrl.hostname === 'phone.email' ||
                    parsedUrl.hostname.endsWith('.phone.email') ||
                    parsedUrl.hostname === 'www.phone.email')
            );
        } catch {
            return false;
        }
    }, { message: "URL must be from phone.email domain" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
