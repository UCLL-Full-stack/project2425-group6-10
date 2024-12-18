import GroupOverviewTable from "@/components/groups/groupOverviewTable";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import Header from "@/components/header";
import GroupService from "@/services/GroupService";
import { Group } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";
import CreateGroup from "@/components/groups/CreateGroup";

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);
  const [groupCode, setGroupCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const fetchGroups = async () => {
    const response = await GroupService.getAllGroups();

    if (response.status === 401) {
      setIsUnauthorized(true);
    } else if (response.ok) {
      const json = await response.json();
      setGroups(json);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      setErrorMessage("Group code cannot be empty.");
      return;
    }

    if (!loggedInUser) {
      setIsUnauthorized(true);
      return;
    }

    const response = await UserService.addGroupToUser(
      loggedInUser.username,
      groupCode
    );

    if (response.ok) {
      fetchGroups();
      setGroupCode("");
      setErrorMessage(null);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Failed to join group.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleJoinGroup();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
    fetchGroups();
  }, []);

  return (
    <>
      <Head>
        <title>Groups</title>
        <meta name="description" content="Overview of groups." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main
        className={`container mx-auto px-6 py-12 ${
          isUnauthorized ? "opacity-50" : "opacity-100"
        }`}
      >
        {(loggedInUser?.role === "admin" ||
          loggedInUser?.role === "lecturer") && (
          <>
            <h1 className="text-3xl font-bold mb-6">Groups</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded mb-6"
            >
              Create Group
            </button>
          </>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
              <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
                Create a New Group
              </h2>
              <CreateGroup onClose={() => setShowCreateModal(false)} />
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-all"
              >
                ✖
              </button>
            </div>
          </div>
        )}
        {/* Show join group if role != admin */}
        {loggedInUser?.role !== "admin" && (
          <div className="mb-6">
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Group Code"
              className="border px-4 py-2 rounded-md mr-4"
            />
            <button
              onClick={handleJoinGroup}
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={!groupCode}
            >
              Join Group
            </button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-500 text-red-700 p-3 rounded mb-4">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Group Overview Table */}
        {groups.length > 0 ? (
          <GroupOverviewTable groups={groups} />
        ) : (
          <p className="text-gray-600">No groups available.</p>
        )}
      </main>

      {isUnauthorized && <UnauthorizedAccess />}
    </>
  );
};

export default Groups;
