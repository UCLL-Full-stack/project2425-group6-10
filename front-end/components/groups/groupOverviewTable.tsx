import { Group } from "@/types";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import GroupService from "@/services/GroupService";
import EditGroupModal from "./UpdateGroup";
import { useTranslation } from "next-i18next";

type Props = {
  groups: Array<Group>;
};

const GroupOverviewTable: React.FC<Props> = ({ groups }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ role: string } | null>(
    null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLoggedInUser(user);
    }
  }, []);

  const handleRowClick = (id: number) => {
    router.push(`/groups/chat/${id}`);
  };

  const handleEditClick = (group: Group) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">{t("groupTable.name")}</th>
            <th className="px-4 py-2 text-left">
              {t("groupTable.description")}
            </th>
            <th className="px-4 py-2 text-left">{t("groupTable.code")}</th>
            {(loggedInUser?.role === "admin" ||
              loggedInUser?.role === "lecturer") && (
              <th className="px-4 py-2 text-left">{t("groupTable.edit")}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr
              key={group.id}
              className="cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleRowClick(group.id)}
            >
              <td className="px-4 py-2 border-b">{group.name}</td>
              <td className="px-4 py-2 border-b">{group.description}</td>
              <td className="px-4 py-2 border-b">{group.code}</td>
              {(loggedInUser?.role === "admin" ||
                loggedInUser?.role === "lecturer") && (
                <td className="px-4 py-2 border-b text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(group);
                    }}
                    className="bg-transparent p-0"
                  >
                    <img
                      src="/pencil-edit-button.svg"
                      alt={t("groupTable.edit")}
                      className="w-5 h-5 transition-transform duration-200 ease-in-out hover:scale-110 hover:text-blue-500"
                    />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && selectedGroup && (
        <EditGroupModal
          group={selectedGroup}
          onClose={() => setShowEditModal(false)}
          onUpdate={async (name, description, regenerateCode) => {
            try {
              const response = await GroupService.updateGroup(
                selectedGroup.id,
                name,
                description,
                regenerateCode
              );
              if (!response.ok) {
                throw new Error(t("groupTable.updateFailed"));
              }

              window.location.reload();
            } catch (error) {
              if (error instanceof Error) {
                alert(error.message);
              } else {
                alert(t("groupTable.unknownError"));
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default GroupOverviewTable;
