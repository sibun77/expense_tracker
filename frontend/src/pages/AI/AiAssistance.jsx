import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import TaskCard from "../../components/Ai/TaskCard.jsx";
import AnalyzeModal from "../../components/Ai/AnalyzeModal.jsx";
import UploadFileModal from "../../components/Ai/UploadFileModal.jsx";
import AnalysisResult from "../../components/Ai/AnalysisResult.jsx";
import ReviewExtractedData from "../../components/Ai/ReviewExtractedData.jsx"; 
import axiosInstance from "../../utils/axiosInstance.js";
import { toast } from "react-hot-toast";
import { useUserAuth } from "../../hooks/useUserAuth.jsx";
import { API_PATHS } from "../../utils/apiPaths.js";
const AiAssistance = () => {
    useUserAuth();

    const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [extractedData, setExtractedData] = useState(null);

    // 🔹 Handle AI Analysis
    const handleAnalyze = async ({ type, period }) => {
        setLoading(true);
        setAnalysis(null);
        setExtractedData(null); // hide upload data when analyzing
        try {
            const resp = await axiosInstance.post(API_PATHS.AI.ANALYZE, { type, period });
            if (resp.data) setAnalysis(resp.data);
            else toast.error("No response from AI");
        } catch (err) {
            console.error("AI analyze error", err);
            toast.error(err.response?.data?.message || "Failed to analyze");
        } finally {
            setLoading(false);
            setShowAnalyzeModal(false);
        }
    };

    // 🔹 Handle AI Extraction
    const handleExtract = (data) => {
        setExtractedData(data);
        setAnalysis(null); // hide analysis when showing upload data
        toast.success("AI extracted transactions successfully!");
    };

    return (
        <DashboardLayout activeMenu="AI Assistance">
            <div className="my-5 mx-auto">
                <h2 className="text-2xl font-semibold mb-4">AI Assistance</h2>

                {/* ---- Cards ---- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TaskCard
                        title="Analyze Your Finances"
                        subtitle="Run AI insights for income, expense or both."
                        onClick={() => setShowAnalyzeModal(true)}
                    />
                    <TaskCard
                        title="Upload & Import Transactions"
                        subtitle="Upload a statement (CSV/XLSX/PDF) and let AI extract data for import."
                        onClick={() => setShowUploadModal(true)}
                    />
                    {/* <TaskCard
                        title="Upload & Analyze"
                        subtitle="Upload file, get AI insights only."
                        onClick={() => toast("Coming soon!")}
                    /> */}
                </div>

                {/* ---- Dynamic Display Area ---- */}
                <div className="mt-6">
                    {extractedData ? (
                        <ReviewExtractedData
                            data={extractedData}
                            onClear={() => setExtractedData(null)}
                        />
                    ) : analysis ? (
                        <AnalysisResult analysis={analysis} />
                    ) : (
                        <div className="text-sm text-gray-500">
                            No data yet. Click a card to start.
                        </div>
                    )}
                </div>

                {/* ---- Modals ---- */}
                <AnalyzeModal
                    open={showAnalyzeModal}
                    onClose={() => setShowAnalyzeModal(false)}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                />
                <UploadFileModal
                    open={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onExtract={handleExtract}
                />
            </div>
        </DashboardLayout>
    );
};

export default AiAssistance;
