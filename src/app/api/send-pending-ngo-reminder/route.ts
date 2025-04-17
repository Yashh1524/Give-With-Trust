// app/api/send-pending-ngo-reminder/route.ts
import { getPendingNGOForProofs } from '@/actions/ngo.action'
import { sendReminderEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const ngos = await getPendingNGOForProofs()

        for (const ngo of ngos) {
            if (ngo.email) {
                await sendReminderEmail("yashxerox1524@gmail.com", ngo.name)
                // console.log(`Sent email to ${ngo.email}`)
            }
        }

        return NextResponse.json({ success: true, sent: ngos.length })
    } catch (error) {
        console.error('Failed to send emails:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
