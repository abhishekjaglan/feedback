import { Message } from "@/model/User";

// type for API response to sign up and for function to verify using email
export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
};
