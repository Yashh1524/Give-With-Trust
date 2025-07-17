"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";

interface ImageUploadProps {
    onChange: (url: string) => void;
    value: string;
    endpoint: "ngoImage" | "ngoImages";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadProps) {
    return value ? (
        <div className="relative h-40 w-40">
            <img
                src={value}
                alt="NGO Logo"
                className="h-40 w-40 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
            />
            <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-0 right-0 bg-red-500 p-1 rounded-full shadow-md"
                title="Remove logo"
            >
                <XIcon className="h-4 w-4 text-white" />
            </button>
        </div>
    ) : (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                if (url) onChange(url);
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
    );
}

export default ImageUpload;
