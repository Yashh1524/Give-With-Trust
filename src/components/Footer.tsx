"use client";

import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";

const socialLinks = [
    {
        href: "https://github.com/Yashh1524",
        icon: <FaGithub size={24} />,
        label: "Github",
    },
    {
        href: "https://www.instagram.com/dev.yashh1524/",
        icon: <FaInstagram size={24} />,
        label: "Instagram",
    },
    {
        href: "https://x.com/YaShh1524",
        icon: <FaXTwitter size={24} />,
        label: "X",
    },
    {
        href: "https://www.linkedin.com/in/yashbhut1524/",
        icon: <FaLinkedin size={24} />,
        label: "LinkedIn",
    },
    {
        href: "https://youtube.com/@yashh_1524?si=PzWdorlUq0Mlq5TY",
        icon: <FaYoutube size={24} />,
        label: "YouTube",
    },
];

const usefulLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "NGOs", href: "/ngos" },
];

const Footer = () => {
    return (
        <footer className="border-t bg-white dark:bg-[#100f1b] text-gray-700 dark:text-gray-300">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo.png" alt="logo" className="w-10 h-8" />
                        <span className="text-xl font-bold text-primary dark:text-white">GiveWithTrust</span>
                    </div>
                    <p className="text-sm">
                        Empowering donations through transparency and trust. Connect with verified NGOs and make an impact.
                    </p>
                </div>

                {/* Useful Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Useful Links</h3>
                    <ul className="space-y-2">
                        {usefulLinks.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className="hover:underline text-sm">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Follow Us</h3>
                    <div className="flex gap-4 items-center flex-wrap">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.label}
                                className="hover:text-primary transition-colors"
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center text-xs py-4 border-t dark:border-gray-700">
                &copy; {new Date().getFullYear()} GiveWithTrust. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
