'use client';

import { Proof } from '@prisma/client';

interface ProofSectionProps {
    proofs: Proof[];
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ProofSection({ proofs }: ProofSectionProps) {
    if (!proofs.length) return null;

    // Group proofs by "month-year"
    const groupedProofs: Record<string, Proof[]> = {};
    for (const proof of proofs) {
        const key = `${proof.month}-${proof.year}`;
        if (!groupedProofs[key]) groupedProofs[key] = [];
        groupedProofs[key].push(proof);
    }

    const sortedKeys = Object.keys(groupedProofs).sort((a, b) => {
        const [am, ay] = a.split('-').map(Number);
        const [bm, by] = b.split('-').map(Number);
        const dateA = new Date(ay, am - 1);
        const dateB = new Date(by, bm - 1);
        return dateB.getTime() - dateA.getTime(); // Newest first
    });

    return (
        <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Work Proofs</h2>
            <div className="space-y-6">
                {sortedKeys.map((key) => {
                    const [month, year] = key.split('-').map(Number);
                    const proofsInMonth = groupedProofs[key];

                    return (
                        <div key={key} className="p-4 border rounded-md dark:border-gray-700">
                            <h3 className="font-semibold text-md text-gray-800 dark:text-white mb-2">
                                {monthNames[month - 1]} {year}
                            </h3>
                            {proofsInMonth.map((proof) => (
                                <div key={proof.id} className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{proof.description}</p>
                                    {proof.mediaUrls.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                                            {proof.mediaUrls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`Proof ${idx + 1}`}
                                                    className="w-full h-auto object-cover rounded border"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
