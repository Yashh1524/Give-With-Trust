'use client'

import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { NGOProfile } from '@prisma/client'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import MultiImagesUpload from './MultiImagesUpload'
import MultiFileUpload from './MultiFileUploadProps'
import { uploadMonthlyWorkProof } from '@/actions/proofs.action'
import { useRouter } from 'next/navigation'

type Props = {
    ngo?: NGOProfile
}

const UploadMonthlyWorkProofsPage: React.FC<Props> = ({ ngo }) => {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        month: '',
        year: '',
        description: '',
        imageUrl: [] as string[],
        proofPdf: [] as string[],
    })

    const router = useRouter()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!ngo) return toast.error('NGO not found')
        if (!form.month || !form.year || !form.description || form.imageUrl.length === 0 || form.proofPdf.length === 0) {
            return toast.error('Please fill all fields and upload files')
        }
    
        try {
            setLoading(true)
            await uploadMonthlyWorkProof(ngo.id, {
                month: form.month,
                year: form.year,
                description: form.description,
                imageUrl: form.imageUrl,
                proofPdf: form.proofPdf,
            })
            toast.success('Proof submitted successfully')
            router.push('/dashboard')
        } catch (err) {
            console.error(err)
            toast.error('Failed to submit proof')
        } finally {
            setLoading(false)
        }
    }

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     if (!ngo) return toast.error('NGO not found')
    //     if (!form.month || !form.year || !form.description || form.imageUrl.length === 0 || form.proofPdf.length === 0) {
    //         return toast.error('Please fill all fields and upload files')
    //     }

    //     try {
    //         setLoading(true)
    //         await uploadMonthlyWorkProof(ngo?.id, form)
    //         toast.success('Proof submitted successfully')
    //         router.push('/dashboard')
    //     } catch (err) {
    //         console.error(err)
    //         toast.error('Failed to submit proof')
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    return (
        <div className="min-h-screen py-10 px-6 md:px-12 bg-white dark:bg-[#100f1b] text-black dark:text-white">
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#1f1f2b] p-8 shadow-md rounded-xl">
                <h1 className="text-2xl font-bold mb-8 text-center">Upload Monthly Work Proof</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Month and Year */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <select
                                name="month"
                                value={form.month}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#282833] dark:text-white"
                            >
                                <option value="">Select Month</option>
                                {[
                                    'JANUARY',
                                    'FEBRUARY',
                                    'MARCH',
                                    'APRIL',
                                    'MAY',
                                    'JUNE',
                                    'JULY',
                                    'AUGUST',
                                    'SEPTEMBER',
                                    'OCTOBER',
                                    'NOVEMBER',
                                    'DECEMBER',
                                ].map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <select
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#282833] dark:text-white"
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Brief about monthly activity..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Proof Images</label>
                        <MultiImagesUpload
                            endpoint="ngoImages"
                            value={form.imageUrl}
                            onChange={(urls) => setForm((prev) => ({ ...prev, imageUrl: urls }))}
                        />
                    </div>

                    {/* PDF Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">PDF Reports</label>
                        <MultiFileUpload
                            endpoint="ngoMonthlyProofs"
                            value={form.proofPdf}
                            onChange={(urls) => setForm((prev) => ({ ...prev, proofPdf: urls }))}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3">
                        <Button type="submit" disabled={loading} className='cursor-pointer'>
                            {loading ? 'Submitting...' : 'Submit Proof'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadMonthlyWorkProofsPage
