'use client';

import { useState, useMemo, useEffect } from 'react';
import { getAllNgo } from '@/actions/ngo.action';
import NGOCard from '@/components/NGOCard';
import { IoSearchOutline } from "react-icons/io5";
import { NGOProfile } from '@prisma/client';
import Loader from '@/components/Loader';
import { useSidebar } from '@/context/SidebarContext';

type FullNgoType = NGOProfile & { user: { name: string | null } };

const Page = () => {

    const { open, toggle } = useSidebar();

    const [ngos, setNgos] = useState<FullNgoType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [sortOption, setSortOption] = useState("newest");

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllNgo();
                setNgos(data);
            } catch (error) {
                console.error("Failed to fetch NGOs", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredNgos = useMemo(() => {
        return ngos.filter(ngo =>
            ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ngo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ngo.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, ngos]);

    const sortedNgos = useMemo(() => {
        const sorted = [...filteredNgos];

        switch (sortOption) {
            case "newest":
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case "raised":
                return sorted.sort((a, b) => b.raisedThisMonth - a.raisedThisMonth);
            case "established":
                return sorted.sort((a, b) => new Date(a.establishedDate).getTime() - new Date(b.establishedDate).getTime());
            default:
                return sorted;
        }
    }, [filteredNgos, sortOption]);

    return (
        <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6 relative w-full md:w-1/2">
                <IoSearchOutline className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                    type="text"
                    placeholder="Search NGOs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-[#1a1b26] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filter Dropdown Menu */}
            <div className="mb-4">
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md dark:bg-[#1a1b26] dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="newest">Newest First</option>
                    <option value="raised">Amount Raised</option>
                    <option value="established">Established Date</option>
                </select>
            </div>

            {/* Loading or Results */}
            {loading ? (
                <Loader />
            ) : filteredNgos.length === 0 ? (
                <p className="text-center text-gray-500">No NGOs found.</p>
            ) : (
                <div className={`grid grid-cols-1 md:grid-cols-3 ${open ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`}>
                    {sortedNgos.map((ngo) => (
                        <NGOCard key={ngo.id} ngo={ngo} />
                    ))}

                </div>
            )}
        </div>
    );
};

export default Page;
