'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const AboutPage = () => {
    return (
        <motion.div
            className="max-w-6xl mx-auto px-6 py-12 space-y-16"
            initial="initial"
            animate="animate"
        >
            {/* Header with Logo */}
            <motion.header
                className="flex flex-col items-center space-y-4 text-center"
                variants={fadeUp}
            >
                <img src="./logo.png" alt="GiveWithTrust Logo" width={80} height={80} />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                    About GiveWithTrust
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                    Empowering transparency and trust in the world of donations.
                </p>
            </motion.header>

            {/* What We Do */}
            <motion.section className="grid md:grid-cols-2 gap-10 items-center" variants={fadeUp}>
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">What We Do</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We connect donors with verified NGOs in a transparent and impactful way. Our platform ensures that every rupee donated is accounted for, and NGOs are encouraged to regularly share their progress.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                        Donated funds are initially held by our platform and are only released to NGOs upon submission of monthly proof of work. If an NGO fails to submit proof within the deadline, the funds are reallocated through a community-driven voting system.
                    </p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <img src="./about.png" alt="Handshake Illustration" width={500} height={400} className="mx-auto rounded-lg shadow" />
                </motion.div>
            </motion.section>

            {/* Why We Do It */}
            <motion.section
                className="space-y-4 text-center max-w-3xl mx-auto"
                variants={fadeUp}
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Why We Do It</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Traditional donation systems often lack transparency, leaving donors unsure about the impact of their contributions. We wanted to fix that.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                    Our goal is to build trust between NGOs and donors by enforcing accountability and rewarding consistency. With our system, you don’t just donate — you participate in the change.
                </p>
            </motion.section>

            {/* Why Choose Us */}
            <motion.section
                className="space-y-6 bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-md"
                variants={fadeUp}
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">Why Choose Us?</h2>
                <ul className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-lg">
                    <li>✅ Transparent donation flow with real-time tracking</li>
                    <li>📄 Monthly proofs required from NGOs to release funds</li>
                    <li>🗳️ Community voting ensures fairness and accountability</li>
                    <li>📊 Insightful dashboards to analyze trends & performance</li>
                    <li>🛡️ Platform-held funds guarantee responsible usage</li>
                </ul>
            </motion.section>

            {/* Call to Action */}
            <motion.section
                className="text-center space-y-4"
                variants={fadeUp}
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Be a Part of the Impact</h2>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                    Whether you are a passionate donor or an NGO looking to build trust, our platform gives you the tools to make a real difference — with clarity and confidence.
                </p>
            </motion.section>

            {/* Buttons with animation */}
            <div className="flex gap-10 flex-wrap items-center justify-center">
                <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0px 4px 20px rgba(59, 130, 246, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Link
                        href="/register-ngo"
                        className="px-6 py-3 rounded-lg text-white font-medium bg-blue-700 hover:bg-blue-800 transition shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-[#466d92] dark:hover:bg-[#3a5d7d] dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
                    >
                        Become an NGO
                    </Link>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0px 4px 20px rgba(59, 130, 246, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Link
                        href="/ngos"
                        className="px-6 py-3 rounded-lg border border-blue-700 text-blue-700 font-medium bg-transparent hover:bg-blue-700 hover:text-white transition shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:border-[#7fa7d1] dark:text-[#7fa7d1] dark:hover:bg-[#7fa7d1] dark:hover:text-black dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900"
                    >
                        Explore NGOs
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
