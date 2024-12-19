import React, { useState } from "react";
import { Group } from "@/types";
import { useTranslation } from "next-i18next";

type Props = {
  group: Group;
  onClose: () => void;
  onUpdate: (
    name: string,
    description: string,
    regenerateCode: boolean
  ) => void;
};

const EditGroupModal: React.FC<Props> = ({ group, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [regenerateCode, setRegenerateCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(name, description, regenerateCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          {t("editGroup.editGroup")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              {t("editGroup.groupName")}
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              {t("editGroup.groupDescription")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
              required
              maxLength={120}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="regenerateCode"
              className="inline-flex items-center"
            >
              <input
                type="checkbox"
                id="regenerateCode"
                checked={regenerateCode}
                onChange={() => setRegenerateCode(!regenerateCode)}
                className="mr-2"
              />
              {t("editGroup.regenerateCode")}
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-500 rounded-md"
          >
            {t("editGroup.updateGroup")}
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default EditGroupModal;
