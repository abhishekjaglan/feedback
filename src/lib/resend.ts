import { Resend } from "resend";

// connecting resend services to project
export const resend = new Resend(process.env.RESEND_API_KEY);