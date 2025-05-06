"use client"

import { Proof } from '@prisma/client';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaFilePdf } from 'react-icons/fa';

const MonthlyProofs = ({ proofs, ngoId }: { proofs: Proof[], ngoId: string }) => {
    // Set the default selected year to the first available year from the proofs
    const initialYear = proofs.length > 0 ? proofs[0].year : new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

    // console.log("proofs:", proofs);

    // Make array for years included in given proofs
    const years = Array.from(new Set(proofs.map((p) => p.year))).sort((a, b) => b - a);

    // Function to toggle the expanded state of a month
    const toggleMonth = (key: string) => {
        setExpandedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Filter proofs by the selected year
    const filteredProofs = proofs.filter((proof) => proof.year === selectedYear);
    

    return (
        <div className="space-y-4 dark:bg-[#1f2937] p-5 rounded-lg">
            <h2 className="text-2xl font-semibold">Monthly Proof Submissions</h2>

            {/* Year Filter */}
            <div>
                <label className="font-medium mr-2">Filter by Year:</label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="border px-3 py-2 rounded dark:bg-[#19202c]"
                >
                    {years.map((year) => (
                        <option key={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Proof Cards */}
            {filteredProofs.map((proof) => {
                const key = `${proof.month}-${proof.year}`;
                const isOpen = expandedMonths[key];

                return (
                    <div
                        key={proof.id}
                        className="border rounded-lg shadow-sm dark:bg-[#19202c] p-4"
                    >
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleMonth(key)}
                        >
                            <h3 className="text-lg font-semibold">
                                {proof.month} {proof.year}
                            </h3>
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        {isOpen && (
                            <div className="mt-4 space-y-3">
                                <p className="text-sm text-gray-300">{proof.description}</p>

                                {/* Images */}
                                {Array.isArray(proof.imageUrl) && proof.imageUrl.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {proof.imageUrl.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt={`proof-img-${idx}`}
                                                className="h-32 rounded object-cover border"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* PDFs */}
                                {Array.isArray(proof.pdfUrl) && proof.pdfUrl.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {proof.pdfUrl.map((url, idx) => (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 bg-white border border-gray-200 shadow-sm rounded-lg hover:shadow-md hover:border-red-500 transition-all duration-200 group"
                                            >
                                                <div className="text-red-600 group-hover:text-red-700 text-xl">
                                                    <FaFilePdf />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-red-700">
                                                    View PDF {idx + 1}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MonthlyProofs;
