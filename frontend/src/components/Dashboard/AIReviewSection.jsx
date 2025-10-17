import { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const AIReviewSection = () => {
    const [review, setReview] = useState(null);

    useEffect(() => {
        const fetchAIReview = async () => {
            try {
                const { data } = await axiosInstance.post(API_PATHS.AI.AI_REVIEW);
                setReview(data);
                console.log(data)
            } catch (err) {
                console.error("Error fetching AI review", err);
            }
        };
        fetchAIReview();
    }, []);

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">💡 AI Financial Insights</h2>
            {
            (review) ?
            (<>
                <p className={`font-bold ${review.status === "danger" ? "text-red-500" : review.status === "warning" ? "text-yellow-500" : "text-green-500"} mt-6`}>
                    Financial Status: {review.status.toUpperCase()}
                </p>

                <div className="mt-3">
                    <h3 className="font-semibold text-green-600">👍 Good Practices</h3>
                    <ul className="list-disc list-inside">
                        {review.goodHabits.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>

                <div className="mt-3">
                    <h3 className="font-semibold text-red-600">👎 Bad Practices</h3>
                    <ul className="list-disc list-inside">
                        {review.badHabits.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>

                <div className="mt-3">
                    <h3 className="font-semibold text-blue-600">💡 Suggestions</h3>
                    <ul className="list-disc list-inside">
                        {review.suggestions.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </>) : (<p>Analyzing your financial data...</p>)
            }
        </div>
    );
}

export default AIReviewSection;