import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request:Request): Promise<Response> {
    
    await dbConnect();

    try {
        const { username, email, password} = await request.json();

        // verifying if username already exits
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if(existingUserVerifiedByUsername){
            const apiResponse: ApiResponse = {
                message: 'Username is alread taken',
                success: false
            };

            return Response.json(
                apiResponse,
                {
                status: 400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode:string = Math.floor(Math.random() * 1000000).toString();

        // if user with email already exists
        if(existingUserByEmail){
            
            if(existingUserByEmail.isVerified){
                const apiResponse: ApiResponse = {
                    message: 'Username is alread exists with this email',
                    success: false
                };
    
                return Response.json(
                    apiResponse,
                    {
                    status: 400
                    }
                ); 
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
            }

        }else{
            
            // user does not exists at all, therefore new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser:User = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });
            
            await newUser.save();
        }

        // send verificaition email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            const apiResponse: ApiResponse = {
                success: false,
                message: emailResponse.message
            };

            return Response.json(
                apiResponse,
                {
                    status: 500
                }
            )
        }

        const apiResponse: ApiResponse = {
            success: true,
            message:'Registering user successfull. Please verify your email!' 
        }
        return Response.json(
            apiResponse,
            {
                status: 201
            }
        );

    } catch (error) {
        console.error('Error registering user', error);

        const apiResponse: ApiResponse = {
            success: false,
            message: 'Error registering user'
        };

        return Response.json(
            apiResponse,
            {
            status: 500
        });
    }

}