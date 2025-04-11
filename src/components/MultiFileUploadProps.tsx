'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/lib/uploadthing';
import { XIcon } from 'lucide-react';

interface MultiFileUploadProps {
    onChange: (urls: string[]) => void;
    value: string[];
    endpoint: 'ngoMonthlyProofs'; // can be changed to a more generic endpoint if needed
}

function MultiFileUpload({ endpoint, onChange, value }: MultiFileUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleRemove = (url: string) => {
        onChange(value.filter((item) => item !== url));
    };

    return (
        <div className="space-y-4">
            {/* Uploaded Files Preview */}
            {value.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {value.map((file, idx) => (
                        <div
                            key={idx}
                            className="relative flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-[#282833]"
                        >
                            <div className="flex items-center gap-2">
                                <div className="text-red-600 text-xl">📄</div>
                                <span className="text-sm truncate max-w-[180px] text-black dark:text-white">
                                    {file.split('/').pop()}
                                </span>
                            </div>
                            <button
                                onClick={() => handleRemove(file)}
                                className="p-1 bg-red-500 rounded-full shadow-md"
                                title="Remove File"
                                type="button"
                            >
                                <XIcon className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-[#282833] text-center">
                    <div className="text-3xl mb-2">📂</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        No files uploaded yet.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Upload PDFs like bills, event reports, or expense breakdowns.
                    </p>
                </div>
            )}

            {/* Upload Dropzone */}
            <UploadDropzone
                endpoint={endpoint}
                onUploadBegin={() => setUploading(true)}
                onClientUploadComplete={(res) => {
                    setUploading(false);
                    const urls = res.map((file) => file.url);
                    onChange([...value, ...urls]);
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

export default MultiFileUpload;
