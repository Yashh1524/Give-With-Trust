import { getNgoByNgoId } from '@/actions/ngo.action';
import { getDbUserId } from '@/actions/user.action';
import DonateBox from '@/components/DonateBox';
import ProofSection from '@/components/ProofSection';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function NGOProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const ngoId = (await params).id
    const ngo = await getNgoByNgoId(ngoId);
    console.log(ngo);
    
    const userId = await getDbUserId()

    if (!ngo) return <div className="text-center py-10 text-red-500">NGO not found.</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ngo.name}</h1>
                    <p className="text-sm text-gray-500">{ngo.email}</p>
                    <div className="flex gap-2 mt-2">
                        {/* <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{ngo.status}</span> */}
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">{ngo.accentTags}</span>
                        {ngo.approved && (
                            <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">Approved</span>
                        )}
                    </div>
                </div>
                {ngo.logo && (
                    <img
                        src={ngo.logo}
                        alt="NGO Logo"
                        width={80}
                        height={80}
                        className="rounded-md border mt-4 md:mt-0"
                    />
                )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Details */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">About</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{ngo.description}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Details</h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li><strong>Established:</strong> {new Date(ngo.establishedDate).toDateString()}</li>
                            <li><strong>Contact:</strong> {ngo.contactInfo}</li>
                            <li><strong>Address:</strong> {ngo.address}</li>
                            {ngo.website && (
                                <li><strong>Website:</strong> <a href={ngo.website} target="_blank" className="text-blue-500 underline">{ngo.website}</a></li>
                            )}
                        </ul>
                    </div>

                    {/* <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Bank Details</h2>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {ngo.accountNumber && <li><strong>Account No:</strong> {ngo.accountNumber}</li>}
                            {ngo.bankName && <li><strong>Bank Name:</strong> {ngo.bankName}</li>}
                            {ngo.ifscCode && <li><strong>IFSC:</strong> {ngo.ifscCode}</li>}
                            {ngo.accountHolderName && <li><strong>Account Holder:</strong> {ngo.accountHolderName}</li>}
                            {ngo.upiId && <li><strong>UPI ID:</strong> {ngo.upiId}</li>}
                        </ul>
                    </div> */}
                </div>

                {/* Right: Proofs + Images */}
                <div className="space-y-4">
                    {ngo.proofPdf && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">NGO Document</h2>
                            <a
                                href={ngo.proofPdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                            >
                                View Uploaded PDF
                            </a>
                        </div>
                    )}

                    {ngo.images.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Uploaded Images</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {ngo.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`NGO Image ${idx + 1}`}
                                        className="w-full h-auto object-cover rounded border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Work Proof Section */}
            <ProofSection proofs={ngo?.proofs} />

            {/* Donate Section */}
            <DonateBox ngoId={ngoId} userId={userId}/>
        </div>
    );
}
