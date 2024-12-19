import React, { useState } from "react";
import GroupService from "../../services/GroupService";
import { useTranslation } from "next-i18next";

interface CreateGroupProps {
  onClose: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!name.trim() || !description.trim()) {
      setError(t("createGroup.nameDescriptionRequired"));
      setLoading(false);
      return;
    }

    try {
      const response = await GroupService.createGroup(name, description);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("createGroup.failedToCreate"));
      }

      setSuccessMessage(t("createGroup.successMessage"));
      setName("");
      setDescription("");

      onClose();
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || t("createGroup.generalError"));
      } else {
        setError(t("createGroup.generalError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          {t("createGroup.groupName")}
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("createGroup.enterGroupName")}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          {t("createGroup.groupDescription")}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("createGroup.enterGroupDescription")}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
          maxLength={80}
          style={{ resize: "none" }}
        ></textarea>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-sm mb-4">{successMessage}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 text-white font-medium rounded-md shadow-sm ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading
          ? t("createGroup.creating")
          : t("createGroup.createGroupButton")}{" "}
      </button>
    </form>
  );
};

export default CreateGroup;
