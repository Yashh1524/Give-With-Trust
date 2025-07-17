// app/api/total-raised/route.ts
import { getTotalRaisedAmount } from "@/actions/donation.action";
import { getTotalNGOCount } from "@/actions/ngo.action";
import { getTotalUserCount } from "@/actions/user.action";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const totalAmountRaised = await getTotalRaisedAmount();
        const totalNGOCount = await getTotalNGOCount()
        const totalUserCount = await getTotalUserCount()
        return NextResponse.json({ 
            totalAmountRaised, 
            totalNGOCount,
            totalUserCount
        });
    } catch (error) {
        console.error("API error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
