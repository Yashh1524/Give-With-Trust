// app/api/notify-pending-ngos/route.ts
import { getPendingNGOForProofs } from '@/actions/ngo.action'
import { sendReminderEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const now = new Date()
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

        // Check if current day is within last 3 days of the month
        if (now.getDate() > lastDay - 3) {
            const pendingNgos = await getPendingNGOForProofs()

            for (const ngo of pendingNgos) {
                if (ngo.email) {
                    await sendReminderEmail(ngo.email, ngo.name)
                    // console.log(`📧 Email sent to ${ngo.email}`)
                }
            }

            return NextResponse.json({ success: true, count: pendingNgos.length })
        } else {
            return NextResponse.json({ skipped: true, message: 'Not within last 3 days of the month' })
        }
    } catch (error) {
        console.error('Notify NGOs Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
