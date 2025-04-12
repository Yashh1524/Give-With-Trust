"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

interface MultiImagesUploadProps {
    onChange: (urls: string[]) => void;
    value: string[]; // multiple image URLs
    endpoint: "ngoImages";
}

export default function MultiImagesUpload({
    endpoint,
    onChange,
    value,
}: MultiImagesUploadProps) {
    const handleRemove = (url: string) => {
        onChange(value.filter((img) => img !== url));
    };

    return (
        <div>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative h-40 w-40">
                            <img
                                src={url}
                                alt={`NGO Image ${index + 1}`}
                                className="h-40 w-40 rounded object-cover border"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(url)}
                                className="absolute top-0 right-0 bg-red-500 p-1 rounded-full shadow-md"
                                title="Remove image"
                            >
                                <XIcon className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    const urls = res.map((file) => file.ufsUrl);
                    onChange([...value, ...urls]); // append new URLs to existing ones
                }}
                onUploadError={(err) => console.error("Upload Error:", err)}
                appearance={{
                    label: "text-sm text-gray-500",
                    allowedContent: "text-xs text-gray-400 mt-1",
                    container:
                        "border border-dashed border-gray-300 p-4 rounded-md hover:border-gray-500 transition-all duration-200 h-[30vh]",
                    uploadIcon: "text-blue-500",
                    button:
                        "bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm",
                }}
                config={{
                    mode: "auto",
                }}
            />
        </div>
    );
}
