import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const identifier = body.email || body.phone;
        const otp = body.OTP;

        if(!identifier || !otp) {
            return NextResponse.json(
                {success: false, error: 'All fields are required'},
                {status: 400}
            );
        }

        const response = await fetch("http://10.21.68.207:10070/api/v1/otp/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identifier, otp })
        })

        const result = await response.json();

        if (!response.ok || !result.success) {
            return NextResponse.json({
                success: false,
                error: result.error || 'OTP verification failed',
                remaining: result.remaining
            }, { status: response.status || 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'OTP verified',
            verified: true
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}