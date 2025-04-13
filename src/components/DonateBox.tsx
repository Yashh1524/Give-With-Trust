'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getNgoByNgoId } from '@/actions/ngo.action';
import { getDonationByNgoId } from '@/actions/donation.action';
import { getMonthlyDonationData, getYearlyDonationTotals } from '@/lib/donationHelpers';

interface DonateBoxProps {
  ngoId: string;
  userId: string | null | undefined;
}

export default function DonateBox({ ngoId, userId }: DonateBoxProps) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const monthlyData = getMonthlyDonationData(donations);
  const yearlyData = getYearlyDonationTotals(donations);

  const fetchDonations = async () => {
    try {
      const ngoDonations = await getDonationByNgoId(ngoId);
      setDonations(ngoDonations);
    } catch (error) {
      console.error("Failed to fetch donations", error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [ngoId]);

  const handleDonation = async () => {
    if (!amount || parseInt(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (!userId) {
      toast.error("Please sign in to donate.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          ngoId,
          userId,
          message,
        }),
      });

      const data = await res.json();

      if (!data?.order?.id) {
        toast.error("Order creation failed.");
        return;
      }

      const ngo = await getNgoByNgoId(data.order.notes.ngoId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.order.amount,
        currency: "INR",
        name: "Give With Trust",
        description: `Donation for ${ngo.name}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.order.id,
                ngoId,
                userId,
                amount: parseInt(amount),
                message,
              }),
            });

            if (verifyRes.ok) {
              toast.success("Donation successful!");
              setAmount('');
              setMessage('');
              await fetchDonations(); // ✅ Refresh donations after success
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Verification request failed.");
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-10 p-6 border rounded-lg bg-gray-50 dark:bg-[#1f2937]">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Support this NGO</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Your contribution will be held by our platform and transferred to the NGO only after valid proof is submitted.
        </p>

        <div className="flex gap-3 mb-4">
          {[100, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount (INR)"
          className="mb-4 w-full px-3 py-2 border rounded-md"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message to NGO (optional)"
          rows={4}
          className="mb-4 w-full px-3 py-2 border rounded-md"
        />

        <button
          onClick={handleDonation}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Donate"}
        </button>
      </div>

    </>
  );
}
