import mongoose, { Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
};

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];       
};

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'please use a avlid email address']
    },
    password:{
        type: String,
        required: [true,'Password is required!']
    },
    verifyCode: {
        type: String,
        required: [true,'Verify code is required!']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true,'Verify code expiry is required!']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
});

// first: if model already exists, second: if it doesnt exist and need to create it in db. All this because of how nextjs works on edge and reloads again and again unlike a designated server
const UserModel = (mongoose.models.User  as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;