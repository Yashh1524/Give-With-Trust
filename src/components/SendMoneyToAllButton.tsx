"use client";

import { updateDonationStatusByNgoId } from '@/actions/donation.action';
import { Donation, NGOProfile } from '@prisma/client';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SendMoneyToAllButtonProps {
    ngos: NGOProfile[];
    donations: Donation[];
    heldTotalsByNgo: Record<string, number>;
}

const SendMoneyToAllButton = ({ ngos, donations, heldTotalsByNgo }: SendMoneyToAllButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleSendAllMoney = async () => {
        setLoading(true);

        try {
            for (const ngo of ngos) {
                if (ngo.status !== "SUBMITTED") continue;

                const amount = heldTotalsByNgo[ngo.id];
                if (!amount || amount <= 0) continue;

                const res = await fetch('/api/send-money-to-submitted-ngo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ngo, amount }),
                });

                const data = await res.json();

                if (data.success) {
                    toast.success(`Sent ₹${amount} to ${ngo.name}`);

                    // Update all donations related to this NGO
                    await updateDonationStatusByNgoId("RELEASED", ngo.id);
                } else {
                    toast.error(`Failed to send to ${ngo.name}: ${data.error}`);
                }
            }
        } catch (err) {
            toast.error('Something went wrong while sending funds');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="px-4 py-2 rounded bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:bg-gray-400 mb-10 mt-5"
            onClick={handleSendAllMoney}
            disabled={loading}
        >
            {loading ? 'Sending...' : 'Send All'}
        </button>
    );
};

export default SendMoneyToAllButton;
