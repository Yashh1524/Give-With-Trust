"use client"

import { NGOProfile } from '@prisma/client';
import React, { useState } from 'react';
import AdminNgoList from './AdminNgoList';

interface NgoListProps {
    ngos: NGOProfile[];
}

const ApprovedNgoForAdminClient: React.FC<NgoListProps> = ({ ngos }) => {
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

    const filteredNgos = selectedStatus === 'ALL'
        ? ngos
        : ngos.filter((ngo) => ngo.status === selectedStatus);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <label htmlFor="statusFilter" className="text-sm font-medium">
                    Filter by Status:
                </label>
                <select
                    id="statusFilter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border px-2 py-1 rounded-md dark:bg-[#292739]"
                >
                    <option value="ALL">All</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="PENDING">Pending</option>
                    <option value="NOT_SUBMITTED">Not Submitted</option>
                </select>
            </div>

            <AdminNgoList ngos={filteredNgos} />
        </div>
    );
};

export default ApprovedNgoForAdminClient;
