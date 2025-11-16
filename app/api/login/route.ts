import { NextResponse } from 'next/server';
import { verifyCredentials, generateToken } from '@/lib/auth';

export async function POST(request: Request){
    try{
        const {username, password} = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Username and password required' },
                { status: 400 }
            );
        }

        const isValid = await verifyCredentials(username, password);

        if(!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 400 }
            );
        }

        const token = await generateToken(username, 'admin');
        return NextResponse.json({
            success: true,
            token,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Login failed' },
            { status: 500 }
        );
    }
}