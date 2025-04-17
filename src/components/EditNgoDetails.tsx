"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateNgoDetails } from '@/actions/ngo.action'
import ImageUpload from '@/components/ImageUpload'
import FileUpload from '@/components/FileUpload'
import toast from 'react-hot-toast'
import MultiImagesUpload from '@/components/MultiImagesUpload'
import { NGOProfile } from '@prisma/client'

interface EditNgoDetailProps {
    ngo: NGOProfile
    ngoId: string
}

const EditNgoDetail = ({ ngo, ngoId }: EditNgoDetailProps) => {
    const [form, setForm] = useState<{
        logo: string
        name: string
        email: string
        establishedDate: Date
        address: string
        contactInfo: string
        website: string
        description: string
        upiId: string
        accountNumber: string
        bankName: string
        ifscCode: string
        accountHolderName: string
        proofPdf: string
        images: string[]
    }>({
        logo: ngo?.logo || "",
        name: ngo?.name || "",
        email: ngo?.email || "",
        establishedDate: ngo?.establishedDate ? new Date(ngo.establishedDate) : new Date() || "",
        address: ngo?.address || "",
        contactInfo: ngo?.contactInfo || "",
        website: ngo?.website || "",
        description: ngo?.description || "",
        upiId: ngo?.upiId || "",
        accountNumber: ngo?.accountNumber || "",
        bankName: ngo?.bankName || "",
        ifscCode: ngo?.ifscCode || "",
        accountHolderName: ngo?.accountHolderName || "",
        proofPdf: ngo?.proofPdf || "",
        images: ngo?.images || [],
    })
    const [showImageUpload, setShowImageUpload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const isValidPaymentInfo = () => {
        const hasUpi = form.upiId.trim() !== ''
        const hasBankDetails =
            form.accountHolderName.trim() &&
            form.accountNumber.trim() &&
            form.bankName.trim() &&
            form.ifscCode.trim()

        return hasUpi || hasBankDetails
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        if (!isValidPaymentInfo()) {
            alert('Please provide either UPI ID or all bank account details.')
            setLoading(false)
            return
        }

        if (
            !form.name ||
            !form.establishedDate ||
            !form.address ||
            !form.email ||
            !form.description ||
            !form.proofPdf ||
            !form.logo
        ) {
            toast.error("Please enter all required field")
            setError(true)
        }

        try {
            await updateNgoDetails(ngoId, form)
            toast.success("Your NGO details updated successfully!")
            router.push('/dashboard')
        } catch (error: any) {
            console.error('Failed to update NGO details:', error)
            // alert(error.message || 'Error registering NGO. Please try again.')
            toast.error("Failed to update NGO details. Please review your input and try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-6 lg:px-12 bg-white dark:bg-[#100f1b] text-black dark:text-white">
            <div className="w-full max-w-[90vw] mx-auto my-10 p-6 bg-white dark:bg-[#1a1b21] shadow-xl rounded-xl">
                <h2 className="text-3xl font-bold mb-8 text-center">Register Your NGO</h2>
                <form onSubmit={handleSubmit} className="space-y-10 w-full">
                    {/* ---------- NGO LOGO ---------- */}
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative group w-full max-w-xs">
                            {form.logo && !showImageUpload ? (
                                <>
                                    <img
                                        src={form.logo}
                                        alt="NGO Logo"
                                        className="h-40 w-40 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 mx-auto"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowImageUpload(true)}
                                        className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow-lg"
                                    >
                                        Change
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center w-full max-w-sm">
                                    <ImageUpload
                                        endpoint="ngoImage"
                                        value={form.logo}
                                        onChange={(url) => {
                                            setForm((prev) => ({ ...prev, logo: url }))
                                            setShowImageUpload(false)
                                        }}
                                    />
                                    {form.logo && (
                                        <button
                                            type="button"
                                            onClick={() => setShowImageUpload(false)}
                                            className="text-sm text-red-600 hover:underline mt-2"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ---------- NGO DETAILS ---------- */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold">Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NGO Name */}
                            <div>
                                <label className="block mb-1 font-medium">NGO Name</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Helping Hands Foundation"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            {/* Established Date */}
                            <div>
                                <label className="block mb-1 font-medium">Established Date</label>
                                <input
                                    type="date"
                                    name="establishedDate"
                                    value={form.establishedDate instanceof Date
                                        ? form.establishedDate.toISOString().split('T')[0]
                                        : form.establishedDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>


                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">Address</label>
                                <input
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="123, Gandhi Nagar, Rajkot"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block mb-1 font-medium">Email Address</label>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="enter email address"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                                <label className="block mb-1 font-medium">Contact Number</label>
                                <input
                                    name="contactInfo"
                                    value={form.contactInfo}
                                    onChange={handleChange}
                                    required
                                    placeholder="enter mobile number"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />

                                <label className="block mb-1 font-medium">Website</label>
                                <input
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    placeholder="website url"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">NGO Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Briefly describe your NGO's mission and work"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            {/* Proof PDF */}
                            <div className="md:col-span-2">
                                <label className="block mb-1 font-medium">NGO Registration Proof (PDF)</label>
                                <div className="w-full max-w-sm">
                                    {form.proofPdf ? (
                                        <div className="flex items-center gap-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800">
                                            {/* PDF Icon */}
                                            <div className="text-red-600 text-2xl">
                                                📄
                                            </div>

                                            {/* File name */}
                                            <p className="flex-1 text-sm truncate">
                                                {form.proofPdf.split('/').pop()}
                                            </p>

                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => setForm((prev) => ({ ...prev, proofPdf: '' }))}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <FileUpload
                                            endpoint="ngoProof"
                                            value={form.proofPdf}
                                            onChange={(url) => setForm((prev) => ({ ...prev, proofPdf: url }))}
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                        <h3 className="text-xl font-semibold">Gallery / Banner Images</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Upload one or more images that represent your NGO’s work or events.
                        </p>

                        <div className="w-full max-w-2xl space-y-4">
                            <MultiImagesUpload
                                endpoint="ngoImages"
                                value={form.images}
                                onChange={(urls) => {
                                    // console.log("Received from MultiImagesUpload:", urls)
                                    setForm((prev) => ({
                                        ...prev,
                                        images: urls,
                                    }))
                                }}
                            />
                        </div>
                    </section>

                    {/* ---------- PAYMENT DETAILS ---------- */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold">
                            Payment Details <span className="text-red-500">*</span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            You must provide either UPI ID or full bank account details.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* UPI ID */}
                            <div>
                                <label className="block mb-1 font-medium">UPI ID</label>
                                <input
                                    name="upiId"
                                    value={form.upiId}
                                    onChange={handleChange}
                                    placeholder="yourname@upi"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            {/* OR Separator */}
                            <div className="md:col-span-2 text-center text-gray-500 dark:text-gray-400 text-sm">— OR —</div>

                            {/* Bank Details */}
                            <div>
                                <label className="block mb-1 font-medium">Account Holder Name</label>
                                <input
                                    name="accountHolderName"
                                    value={form.accountHolderName}
                                    onChange={handleChange}
                                    placeholder="e.g. Raj Patel"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Account Number</label>
                                <input
                                    name="accountNumber"
                                    value={form.accountNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. 1234567890"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Bank Name</label>
                                <input
                                    name="bankName"
                                    value={form.bankName}
                                    onChange={handleChange}
                                    placeholder="e.g. HDFC Bank"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">IFSC Code</label>
                                <input
                                    name="ifscCode"
                                    value={form.ifscCode}
                                    onChange={handleChange}
                                    placeholder="e.g. HDFC0001234"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-transparent"
                                />
                            </div>
                        </div>
                    </section>

                    {/* ---------- SUBMIT ---------- */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary dark:bg-white dark:text-black text-white py-3 text-lg rounded-lg hover:bg-opacity-90 transition"
                        >
                            {loading ? 'Submitting...' : 'Update NGO Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditNgoDetail
