import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
    password: process.env.IRON_SESSION_PASSWORD as string,
    cookieName: 'simtech_session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export interface SessionData {
    user?: {
        _id: string;
        name: string;
        phone: string;
        location: string;
        email?: string;
        address?: string;
        isAdmin?: boolean;
    };
    isLoggedIn: boolean;
}

declare module 'iron-session' {
    interface IronSessionData extends SessionData { }
}
