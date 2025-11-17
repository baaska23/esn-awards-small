import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch("http://10.21.68.207:10070/api/v1/otp/config");
        const result = await response.json();

        if (!response.ok || !result.success) {
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to fetch OTP config' },
                { status: response.status || 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error fetching OTP config:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch OTP config' },
            { status: 500 }
        );
    }
}