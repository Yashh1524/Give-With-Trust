import { NextResponse } from 'next/server';

const RAZORPAYX_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RAZORPAYX_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const BASE_URL = 'https://api.razorpay.com/v1';

const razorpayPost = async (endpoint: string, body: any) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization:
                'Basic ' + Buffer.from(`${RAZORPAYX_KEY}:${RAZORPAYX_SECRET}`).toString('base64'),
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed ${endpoint}: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res.json();
};

export async function POST(req: Request) {
    try {
        const { ngo, amount } = await req.json();

        if (!ngo || !amount) {
            return NextResponse.json({ success: false, error: 'Missing ngo or amount' }, { status: 400 });
        }

        // Step 1: Create Contact
        const contact = await razorpayPost('/contacts', {
            name: ngo.name,
            email: ngo.email,
            contact: ngo.contactInfo,
            type: 'vendor',
        });
        // console.log("ngo.name:", ngo.name);
        // console.log("contact:", contact);
        

        // Step 2: Create Fund Account
        let fundAccount;

        if (ngo.accountNumber && ngo.ifscCode && ngo.accountHolderName) {
            // Use Bank Account
            fundAccount = await razorpayPost('/fund_accounts', {
                contact_id: contact.id,
                account_type: 'bank_account',
                bank_account: {
                    name: ngo.accountHolderName,
                    ifsc: ngo.ifscCode,
                    account_number: ngo.accountNumber,
                },
            });
        } else if (ngo.upiId) {
            // Use UPI as fallback
            fundAccount = await razorpayPost('/fund_accounts', {
                contact_id: contact.id,
                account_type: 'vpa',
                vpa: {
                    address: ngo.upiId,
                },
            });
        } else {
            return NextResponse.json({
                success: false,
                error: 'NGO must have either bank details or UPI ID',
            }, { status: 400 });
        }


        // Step 3: Create Payout
        const payout = await razorpayPost('/payouts', {
            account_number: '2323230016719731',
            fund_account_id: fundAccount.id,
            amount: amount * 100,
            currency: 'INR',
            mode: 'IMPS',
            purpose: 'payout',
            queue_if_low_balance: true,
        });

        // console.log(`₹${amount} sent to ${ngo.name}:`, payout.id);

        return NextResponse.json({
            success: true,
            payoutId: payout.id,
            ngo: ngo.name,
        });
    } catch (err: any) {
        console.error('❌ RazorpayX Payout Error:', err.message || err);
        return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
