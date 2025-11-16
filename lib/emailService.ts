import { rateLimit } from "./rateLimit";

export interface EmailOTPResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export async function sendEmailOTP(
    email: string,
    otp: string
): Promise<EmailOTPResponse> {
    const {success, remaining, reset} = rateLimit(`email:${email}`, 3, 60 * 60 * 1000);
    if(!success) {
        return {
            success: false,
            error: 'Too many email OTP requests. Try again later.'
        }
    }
    
    try {
        const response = await fetch('http://10.21.68.141:8283/email/single', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: [email],
                subject: "ESN Awards 2025",
                content: `<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <style>\n        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n        .container { max-width: 600px; margin: 0 auto; padding: 20px; }\n        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }\n        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }\n        .coupon { background: #fff; border: 2px dashed #0066cc; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }\n        .coupon-code { font-size: 24px; font-weight: bold; color: #0066cc; letter-spacing: 2px; }\n        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px; }\n        .footer { text-align: center; margin-top: 30px; color: #666; }\n    </style>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"header\">\n      </div>\n        <div class=\"content\">\n            <p>Сайн байна уу,</p>\n            <p>Баталгаажуулах кодыг ашиглан ESN Awards 2025 саналаа өгөөрэй.</p>\n            \n            <div class=\"coupon\">\n                <div style=\"font-size: 18px; margin-bottom: 10px;\"> Таны код:</div>\n                <div class=\"coupon-code\">${otp}</div>\n            </div>\n        <div class=\"footer\">\n            <p>© 2025 EsportsNetwork, Unitel. Бүх эрх хуулиар хамгаалагдсан.</p>\n        </div>\n    </div>\n</body>\n</html>
                `
            }),
        });

        if(!response.ok) {
            const error = await response.text();
            console.error('Email api error: ', error);
            return {
                success: false,
                error: "Failed to sent email OTP"
            }
        }

        return{
            success: true,
            message: "Email sent successfully"
        }
    } catch(error) {
        console.error('Error sending email:', error);
        return { 
            success: false, 
            error: 'Failed to send email' 
        };
    }
}