import { NextAuthOptions } from "next-auth";
import  CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {

    // araty of ways you want auth to be
    providers:[
        // auth using custom credentials and its declaration 
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            // decleration of entities used for auth using credentials 
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: 'abhishek@gmail.com'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },

            // function that will perform auth (again custom as next-auth does not provide this)
            async authorize(credentials: any): Promise<any>{
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {   email: credentials.identifier.emailn    },
                            {   username: credentials.identifier.username  }
                        ]
                    });

                    if(!user){
                        throw new Error('No user found with this email!');
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your account first');
                    }

                    const isPasswordCorrect:boolean = await bcrypt.compare(credentials.password, user.password);

                    if(isPasswordCorrect){
                        console.log("User inside Authorise function of NEXT-AUTH :: ", user);
                        return user;
                    } else {
                        throw new Error('Incorect Password');
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks:{
        async session({ session, token  }){
            if(token){
                session.user._id = token._id,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.isVerified = token.isVerified,
                session.user.username = token.username
            }
            return session;
        },
        async jwt ({ token, user }){
            if(user){
                token._id = user._id?.toString(),
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages,
                token.username = user.username
            }
            return token;
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}