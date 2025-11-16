import { verifyOTP } from "@/lib/otp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const {identifier, code, type} = await request.json();

        if(!identifier || !code || !type) {
            return NextResponse.json(
                {success: false, error: 'All fields are required'},
                {status: 400}
            );
        }

        const result = verifyOTP(identifier, code);

        if(!result.success) {
            return NextResponse.json({
                success: false,
                error: result.error,
                remaining: result.remaining
            })
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