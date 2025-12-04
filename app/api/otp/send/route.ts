import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {email, phone, type} = await request.json();
        console.log("Log nextjs: ", email, type, phone);
        if(type === 'sms') {
            return NextResponse.json(
                {success: false, error: 'Dugaarar bolomjgui'},
                {status: 400}
            );
        }

        if(!type || (type !== 'email' && type !== 'sms')) {
            return NextResponse.json(
                {success: false, error: 'Invalid type'},
                {status: 400}
            );
        }

        if(type === 'email' && !email) {
            return NextResponse.json(
                {success: false, error: 'Email is required'},
                {status: 400}
            )
        }

        // if(type === 'sms' && !phone) {
        //     return NextResponse.json(
        //         {success: false, error: 'Phone number is required'},
        //         {status: 400}
        //     )
        // }

        const identifier = email;
        const app_name = "esnAwards";
        
        const response = await fetch("http://10.21.68.21/otp/api/v1/otp/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({identifier, type, app_name})
        })

        const result = await response.json();
        console.log("Backend response:", result);
        
        if (!response.ok || !result.success) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to send OTP' },
                { status: response.status || 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send OTP' },
            { status: 500 }
        );
    }
}