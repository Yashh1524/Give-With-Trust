// app/api/send-new-voting-session-email/route.ts
import { NextResponse } from 'next/server';
import { sendNewVotingSessionEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { to, failedNgoName, sessionId } = await req.json();

        if (!to || !failedNgoName || !sessionId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await sendNewVotingSessionEmail(to, failedNgoName, sessionId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in email API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
