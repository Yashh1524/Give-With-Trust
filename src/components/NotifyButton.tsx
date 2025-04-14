'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const NotifyButton = () => {
    const [loading, setLoading] = useState(false)

    const handleNotify = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/send-pending-ngo-reminder', {
                method: 'POST',
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`Notified ${data.sent} pending NGOs`)
            } else {
                toast.error('Failed to send emails')
            }
        } catch (err) {
            toast.error('Error while sending emails')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="my-4">
            <Button onClick={handleNotify} disabled={loading} className='w-full lg:w-fit'>
                {loading ? 'Sending...' : 'Send Notification to Pending NGOs'}
            </Button>
        </div>
    )
}

export default NotifyButton
