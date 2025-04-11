"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [amount, setAmount] = useState(0);
  const [ngos, setNgos] = useState(0);
  const [donors, setDonors] = useState(0);

  useEffect(() => {
    const animateValue = (target: number, setter: (val: number) => void) => {
      let start = 0;
      const duration = 1000;
      const step = target / (duration / 10);

      const interval = setInterval(() => {
        start += step;
        if (start >= target) {
          setter(target);
          clearInterval(interval);
        } else {
          setter(Math.floor(start));
        }
      }, 10);
    };

    animateValue(500000, setAmount);
    animateValue(100, setNgos);
    animateValue(1200, setDonors);
  }, []);

  return (
    <div className="bg-white dark:bg-[#100f1b] text-white px-4 sm:px-6 lg:px-8 py-3">
      {/* Quote Section */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary">
          “Transparency builds trust. Trust powers change.”
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
          GiveWithTrust ensures every donation is backed by proof. We verify NGOs,
          track impact, and empower donors to make meaningful choices.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {/* Total Impact */}
        <motion.div
          className="col-span-1 sm:col-span-2 lg:col-span-3 rounded-2xl py-4 px-6 sm:px-8 bg-blue-200 shadow-md hover:scale-[1.01] transition text-gray-900 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">📈 Total Impact</h2>
              <p className="text-3xl md:text-5xl font-extrabold text-blue-950 mb-1">
                ₹{amount.toLocaleString()}+
              </p>
              <p className="text-sm text-blue-800">donated through GiveWithTrust</p>
            </div>
            <div>
              <ul className="text-sm md:text-base space-y-1 text-blue-900 font-medium">
                <li>🎯 {ngos}+ NGOs Supported</li>
                <li>👥 {donors}+ Donors</li>
              </ul>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 text-6xl opacity-10 select-none">💸</div>
        </motion.div>

        {/* Featured NGO */}
        <motion.div
          className="lg:col-span-2 rounded-2xl px-6 sm:px-8 py-4 shadow-md hover:scale-[1.01] transition text-gray-900 relative overflow-hidden bg-yellow-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold mb-2 text-yellow-800">🌟 Featured NGO</h2>
              <p className="text-base text-yellow-900">
                Discover the NGO of the month and the real-world impact they're creating.
              </p>
            </div>
            <Link
              href="/featured-ngo"
              className="mt-4 inline-block text-sm font-semibold text-yellow-800 hover:underline hover:text-yellow-900"
            >
              View More →
            </Link>
          </div>
          <div className="absolute right-4 bottom-4 text-5xl opacity-10 select-none">🏅</div>
        </motion.div>

        {/* What We Do */}
        <motion.div
          className="rounded-2xl px-6 sm:px-8 py-4 shadow-md hover:scale-[1.01] transition text-gray-900 relative overflow-hidden bg-cyan-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold mb-2 text-cyan-800">💼 What We Do</h2>
              <p className="text-base text-cyan-900">
                From verifying NGOs to releasing funds only after proof—learn how we ensure your donations make real impact.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-4 inline-block text-sm font-semibold text-cyan-800 hover:underline hover:text-cyan-900"
            >
              Learn More →
            </Link>
          </div>
          <div className="absolute right-4 bottom-4 text-5xl opacity-10 select-none">📘</div>
        </motion.div>

        {/* All NGOs */}
        <motion.div
          className="rounded-2xl px-6 sm:px-8 py-4 shadow-md hover:scale-[1.01] transition text-gray-900 relative overflow-hidden bg-emerald-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold mb-2 text-emerald-800">🏢 All NGOs</h2>
              <p className="text-base text-emerald-900">
                View the full list of verified NGOs and their current impact reports.
              </p>
            </div>
            <Link
              href="/ngos"
              className="mt-4 inline-block text-sm font-semibold text-emerald-800 hover:underline hover:text-emerald-900"
            >
              Show All →
            </Link>
          </div>
          <div className="absolute right-4 bottom-4 text-5xl opacity-10 select-none">🏷️</div>
        </motion.div>

        {/* Top Donors */}
        <motion.div
          className="rounded-2xl px-6 sm:px-8 py-4 shadow-md hover:scale-[1.01] transition text-gray-900 relative overflow-hidden bg-pink-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold mb-2 text-pink-800">🏅 Top Donors</h2>
              <p className="text-base text-pink-900">
                Meet the generous individuals making a difference through their contributions.
              </p>
            </div>
            <Link
              href="/donors"
              className="mt-4 inline-block text-sm font-semibold text-pink-800 hover:underline hover:text-pink-900"
            >
              View All Donors →
            </Link>
          </div>
          <div className="absolute right-4 bottom-4 text-5xl opacity-10 select-none">💖</div>
        </motion.div>

        {/* Why Trust Us */}
        <motion.div
          className="relative rounded-2xl px-6 sm:px-8 py-4 bg-[#ffeee8] shadow-md hover:scale-[1.02] transition text-gray-800 border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-orange-800">
            🔐 Why Trust Us?
          </h2>
          <ul className="space-y-2 text-sm text-orange-900">
            <li className="flex items-center gap-2">✅ Verified NGOs</li>
            <li className="flex items-center gap-2">🔍 Proof-based release</li>
            <li className="flex items-center gap-2">📊 Transparent reports</li>
          </ul>
          <div className="absolute right-4 bottom-4 text-5xl opacity-10 select-none pointer-events-none">
            🛡️
          </div>
        </motion.div>
      </div>
    </div>
  );
}
