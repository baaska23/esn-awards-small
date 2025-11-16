import { error } from "console";
import { rateLimit } from "./rateLimit";

interface SMSOTPResponse {
    success: boolean;
    message?: string;
    error?: string;
}

//make sure it wont send too many sms at the same time
export async function sendSMSOTP(
    phoneNumber: string,
    otp: string
): Promise<SMSOTPResponse> {
    const {success, remaining, reset} = rateLimit(`sms:${phoneNumber}`, 3, 60 * 60 * 1000);
    if(!success) {
        return {
            success: false,
            error: 'Too many OTP requests. Try again later'
        }
    }
    
    try {
        const response = await fetch('http://10.21.68.21/vorest/v1/sv/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'Authorization': 'Basic ZGV2OnRlYW0=' 
            },
            body: JSON.stringify({
                from: "8379",
                to: phoneNumber,
                text: `ESN Awards 2025 - Tanii batalgaajuulah kod: ${otp}`,
            })
        })

        if(!response.ok) {
            const error = await response.text();
            console.error('Sms api error: ', error);
            return {
                success: false,
                error: "Failed to sent sms OTP"
            }
        }
        
        return{
            success: true,
            message: "SMS sent successfully"
        }
    } catch(error) {
        console.error("Error sending SMS:", error);
        return{
            success: false,
            error: "Failed to send SMS"
        }
    }
}