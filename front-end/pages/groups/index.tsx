import GroupOverviewTable from "@/components/groups/groupOverviewTable";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import Header from "@/components/header";
import GroupService from "@/services/GroupService";
import { Group } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);
  const [groupCode, setGroupCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchGroups = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const response = await GroupService.getAllGroups();

    if (response.status === 401) {
      setIsUnauthorized(true);
    } else if (response.ok) {
      const json = await response.json();
      setGroups(json);
    }
  };

  const handleJoinGroup = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Failed to join group.");
    }
  };

  useEffect(() => {
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
        <h1 className="text-3xl font-bold mb-6">Groups</h1>

        {/* Input for Group Code */}
        <div className="mb-6">
          <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
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

        {/* Error Message */}
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        {/* Group Overview Table */}
        {groups.length > 0 ? (
          <GroupOverviewTable groups={groups} onRowClick={() => {}} />
        ) : (
          <p className="text-gray-600">No groups available.</p>
        )}
      </main>

      {isUnauthorized && <UnauthorizedAccess />}
    </>
  );
};

export default Groups;
