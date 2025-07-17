'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/lib/uploadthing';
import { XIcon } from 'lucide-react';

interface FileUploadProps {
    onChange: (url: string) => void;
    value: string;
    endpoint: 'ngoProof';
}

function FileUpload({ endpoint, onChange, value }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);

    if (value) {
        return (
            <div className="relative w-fit max-w-xs">
                <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-white dark:bg-gray-900">
                    <span className="text-sm truncate max-w-[180px] text-black dark:text-white">
                        {value.split('/').pop()}
                    </span>
                    <button
                        onClick={() => onChange('')}
                        className="ml-auto p-1 bg-red-500 rounded-full shadow-md"
                        title="Remove File"
                        type="button"
                    >
                        <XIcon className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <UploadDropzone
                endpoint={endpoint}
                onUploadBegin={() => setUploading(true)}
                onClientUploadComplete={(res) => {
                    setUploading(false);
                    // console.log('Upload complete:', res);
                    if (res && res.length > 0) {
                        onChange(res[0].url);
                    }
                }}
                onUploadError={(error: Error) => {
                    setUploading(false);
                    console.error('Upload Error:', error);
                    alert('Upload failed. Please try again.');
                }}
                appearance={{
                    container:
                        'border border-dashed border-gray-300 p-4 rounded-md hover:border-gray-500 transition-all duration-200',
                    label: 'text-sm text-gray-500',
                    allowedContent: 'text-xs text-gray-400 mt-1',
                    uploadIcon: 'text-blue-500 w-15 h-15',
                    button:
                        'bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm',
                }}
                config={{
                    mode: 'auto',
                }}
            />
            {uploading && (
                <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
            )}
        </div>
    );
}

export default FileUpload;
