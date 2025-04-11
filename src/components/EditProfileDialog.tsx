'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ImageUpload from '@/components/ImageUpload'
import { User } from '@prisma/client'
import { updateUserDetails } from '@/actions/user.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

type Props = {
    user: User
}

const EditProfileDialog: React.FC<Props> = ({ user }) => {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        username: user.username,
        name: user.name || '',
        bio: user.bio || '',
        image: user.image || '',
    })
    const [showImageUpload, setShowImageUpload] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            await updateUserDetails(user.id, form)
            toast.success('Profile updated successfully!')
            setOpen(false)
        } catch (err: any) {
            console.error(err)
            toast.error('Failed to update profile.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium shadow transition dark:bg-[#466d92] dark:hover:bg-[#3a5d7d]">
                    Edit Profile
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md w-full dark:bg-[#100f1b]">
                <DialogHeader>
                    <DialogTitle>Edit Your Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Profile Image Upload */}
                    <div className="flex justify-center">
                        {form.image && !showImageUpload ? (
                            <div className="relative group">
                                <img
                                    src={form.image}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowImageUpload(true)}
                                    className="absolute bottom-0 right-0 text-xs px-2 py-1 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full">
                                <ImageUpload
                                    endpoint="ngoImage"
                                    value={form.image}
                                    onChange={(url) => {
                                        setForm((prev) => ({ ...prev, image: url }))
                                        setShowImageUpload(false)
                                    }}
                                />
                                {form.image && (
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

                    {/* Inputs */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Username</label>
                            <Input name="username" value={form.username} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input name="name" value={form.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Bio</label>
                            <Textarea name="bio" value={form.bio} onChange={handleChange} rows={3} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog
