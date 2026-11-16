import { NextResponse } from "next/server";
import { signVoteToken } from "@/lib/vote-token";
import { LIMITS, clientIp, rateLimit } from "@/lib/rate-limit";

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

        const limited = await rateLimit([
            [LIMITS.otpVerifyEmail, identifier],
            [LIMITS.otpVerifyIp, clientIp(request)],
        ]);
        if (limited) return limited;

        const response = await fetch("http://10.21.68.21/otp/api/v1/otp/verify", {
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
            verified: true,
            // Required by /api/submit as proof of this verification.
            voteToken: signVoteToken(identifier)
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}