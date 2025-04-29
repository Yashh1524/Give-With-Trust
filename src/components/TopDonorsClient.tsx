'use client';

import Link from "next/link";
import { motion } from "framer-motion";

interface TopDonorsClientProps {
    donors: [string, { amount: number; name: string; image: string; id: string }][];
}

export default function TopDonorsClient({ donors }: TopDonorsClientProps) {
    const topThree = donors.slice(0, 3);
    const others = donors.slice(3);

    return (
        <div className="flex flex-col items-center gap-5 px-4">
            {/* Title Section */}
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white">🏆 Top Donors</h1>
                <p className="text-gray-400 mt-2 text-sm md:text-base">
                    Thank you for your generous contributions!
                </p>
            </div>

            {/* Podium */}
            <div className="flex justify-center items-end gap-6 mt-5 w-full max-w-4xl">
                {/* 2nd place */}
                {topThree[1] && (
                    <Link href={`/profile/${topThree[1][1].id}`} className="flex flex-col items-center group">
                        <motion.div
                            className="w-20 h-20 md:w-24 md:h-24 relative mb-2"
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={topThree[1][1].image}
                                alt={topThree[1][1].name}
                                className="object-cover rounded-full border-4 border-gray-400 w-full h-full"
                            />
                        </motion.div>
                        <p className="font-semibold group-hover:text-purple-500 text-sm md:text-base">{topThree[1][1].name}</p>
                        <p className="text-gray-500 text-xs md:text-sm">₹{topThree[1][1].amount}</p>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "2.5rem" }}
                            transition={{ duration: 1 }}
                            className="bg-gray-400 w-10 md:w-20 rounded-t-md mt-2"
                        />
                        <p className="text-xs md:text-sm font-bold mt-1">2nd</p>
                    </Link>
                )}

                {/* 1st place */}
                {topThree[0] && (
                    <Link href={`/profile/${topThree[0][1].id}`} className="flex flex-col items-center group">
                        <motion.div
                            className="w-24 h-24 md:w-32 md:h-32 relative mb-2"
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <img
                                src={topThree[0][1].image}
                                alt={topThree[0][1].name}
                                className="object-cover rounded-full border-4 border-yellow-400 w-full h-full"
                            />
                        </motion.div>
                        <p className="font-semibold group-hover:text-purple-500 text-sm md:text-base">{topThree[0][1].name}</p>
                        <p className="text-gray-500 text-xs md:text-sm">₹{topThree[0][1].amount}</p>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "3.5rem" }}
                            transition={{ duration: 1 }}
                            className="bg-yellow-400 w-10 md:w-20 rounded-t-md mt-2"
                        />
                        <p className="text-xs md:text-sm font-bold mt-1">1st</p>
                    </Link>
                )}

                {/* 3rd place */}
                {topThree[2] && (
                    <Link href={`/profile/${topThree[2][1].id}`} className="flex flex-col items-center group">
                        <motion.div
                            className="w-20 h-20 md:w-24 md:h-24 relative mb-2"
                            whileHover={{ scale: 1.1 }}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <img
                                src={topThree[2][1].image}
                                alt={topThree[2][1].name}
                                className="object-cover rounded-full border-4 border-orange-400 w-full h-full"
                            />
                        </motion.div>
                        <p className="font-semibold group-hover:text-purple-500 text-sm md:text-base">{topThree[2][1].name}</p>
                        <p className="text-gray-500 text-xs md:text-sm">₹{topThree[2][1].amount}</p>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "1.5rem" }}
                            transition={{ duration: 1 }}
                            className="bg-orange-400 w-10 md:w-20 rounded-t-md mt-2"
                        />
                        <p className="text-xs md:text-sm font-bold mt-1">3rd</p>
                    </Link>
                )}
            </div>

            {/* Other Donors List */}
            <div className="w-full max-w-md mt-10 space-y-3">
                {others.map(([id, donor], index) => (
                    <motion.div
                        key={id}
                        className="flex items-center gap-4 border-b py-3"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div className="relative w-10 h-10 md:w-12 md:h-12">
                            <img
                                src={donor.image}
                                alt={donor.name}
                                className="object-cover rounded-full w-full h-full"
                            />
                        </div>
                        <div className="flex-1">
                            <Link href={`/profile/${donor.id}`}>
                                <p className="font-medium hover:text-purple-500 text-sm md:text-base">{donor.name}</p>
                            </Link>
                            <p className="text-gray-500 text-xs md:text-sm mt-1">₹{donor.amount}</p>
                        </div>
                        <p className="text-gray-400 font-semibold text-xs md:text-sm">#{index + 4}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
