import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";


const UploadFileModal = ({ open, onClose, onExtract }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const resp = await axiosInstance.post(
                API_PATHS.AI.EXTRACT_TRANSACTIONS,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 180000, // 3 minutes
                }
            );

            if (resp.data?.data) {
                toast.success("Transactions extracted!");
                onExtract(resp.data.data); // pass structured data to parent
                onClose();
            } else {
                toast.error("Failed to extract data");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h4 className="text-xl font-semibold mb-4">Upload Statement</h4>
                <p className="text-sm text-gray-600 mb-3">
                    Supported formats: PDF, CSV, XLSX, TXT
                </p>

                <input
                    type="file"
                    accept=".pdf,.csv,.xlsx,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 w-full mb-4 rounded"
                />

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        className="px-4 py-2 bg-primary text-white rounded"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadFileModal;
