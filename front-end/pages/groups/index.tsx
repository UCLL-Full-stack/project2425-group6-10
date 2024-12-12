import GroupOverviewTable from "@/components/groups/groupOverviewTable";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import Header from "@/components/header";
import GroupService from "@/services/GroupService";
import { Group } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);

  const fetchGroups = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const username = loggedInUser?.username;
    const role = loggedInUser?.role;

    if (!username || !role) {
      setIsUnauthorized(true);
      return;
    }

    const response = await GroupService.getAllGroups(username, role);

    if (response.status === 401) {
      setIsUnauthorized(true);
    } else if (response.ok) {
      const json = await response.json();
      setGroups(json);
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
