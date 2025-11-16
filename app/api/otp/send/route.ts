import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { generateOTP, storeOTP } from '@/lib/otp';
import { sendEmailOTP } from '@/lib/emailService';
import { sendSMSOTP } from '@/lib/smsService';

export async function POST(request: Request) {
    try {
        const {email, phone, type} = await request.json();

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

        if(type === 'sms' && !phone) {
            return NextResponse.json(
                {success: false, error: 'Phone number is required'},
                {status: 400}
            )
        }

        const identifier = type === 'email' ? email : phone;
        const ip = request.headers.get('x-forwarded-for') ?? 'anynomous';
        // const { success: rateLimitSuccess } = rateLimit(
        //     `otp:${ip}:${identifier}`,
        //     3,              // 3 OTP requests
        //     10 * 60 * 1000  // per 10 minutes
        // );

        // if (!rateLimitSuccess) {
        // return NextResponse.json(
        //         { 
        //             success: false, 
        //             error: 'Хэт олон удаа код авахыг оролдлоо. 10 минутын дараа дахин оролдоно уу.' 
        //         },
        //             { status: 429 }
        //     );
        // }

        const otp = generateOTP(6);
        storeOTP(identifier, otp, 6);

        let result;

        if(type === 'email') {
            result = sendEmailOTP(email, otp);
        } else {
            result = sendSMSOTP(phone, otp);
        }

        if(!(await result).success) {
            return NextResponse.json(
                {success: false, error: (await result).error},
                {status: 500}
            )
        }

        return NextResponse.json({
            success: true,
            message: `Баталгаажуулах код ${type === 'email' ? 'email' : 'phone number'} руу илгээлээ`,
            expiresIn: 300
        })
    } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}