import React, { useState } from "react";
import ReportService from "@/services/ReportService";

type ReportModalProps = {
  messageId: number;
  onClose: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ messageId, onClose }) => {
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReportSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await ReportService.createReport(messageId, description);
      if (response.ok) {
        alert("Report submitted successfully.");
        onClose();
      } else {
        setError("Failed to submit the report. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Report Message</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={200} // Limit input to 200 characters
          className="w-full p-2 border rounded-lg mb-4 resize-none" // `resize-none` disables resizing
          placeholder="Enter your report description here..."
        />
        <div className="text-sm text-gray-500">
          {description.length}/200 characters
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleReportSubmit}
            disabled={isSubmitting || !description.trim()}
            className={`${
              isSubmitting || !description.trim()
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white px-4 py-2 rounded-lg`}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
