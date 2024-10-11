import 'next-auth';
import { DefaultSession } from 'next-auth';

// extending or redeclaring interfaces/types of objects used in next-auth to make it recognize our needs 
declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean,
        isAcceptingMessages?: boolean;
        username?: string
    }

    interface Session{
        user: {
            _id?: string;
            isVerified?: boolean,
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean,
        isAcceptingMessages?: boolean;
        username?: string
    }
}