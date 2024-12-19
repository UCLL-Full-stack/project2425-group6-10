import React, { useState } from "react";
import ReportService from "@/services/ReportService";
import { useTranslation } from "next-i18next";

type ReportModalProps = {
  messageId: number;
  onClose: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ messageId, onClose }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReportSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await ReportService.createReport(messageId, description);
      if (response.ok) {
        alert(t("reportModal.successMessage"));
        onClose();
      } else {
        setError(t("reportModal.failureMessage"));
      }
    } catch (error) {
      setError(t("reportModal.errorMessage"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{t("reportModal.title")}</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={200}
          className="w-full p-2 border rounded-lg mb-4 resize-none"
          placeholder={t("reportModal.placeholder")}
        />
        <div className="text-sm text-gray-500">
          {description.length}/200 {t("reportModal.characters")}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            {t("reportModal.cancel")}
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
            {isSubmitting
              ? t("reportModal.submitting")
              : t("reportModal.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
