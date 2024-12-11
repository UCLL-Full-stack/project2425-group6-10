import GroupOverviewTable from "@/components/groups/groupOverviewTable";
import Header from "@/components/header";
import UserOverviewTable from "@/components/users/UserOverviewTable";
import GroupService from "@/services/GroupService";
import UserService from "@/services/UserService";
import { Group, User } from "@/types";
import Head from "next/head";
import { useEffect, useState } from "react";

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Array<Group>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [groupClicked, setGroupClicked] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<number | null>(null);

  const getGroups = async () => {
    const response = await GroupService.getAllGroups();
    const json = await response.json();
    setGroups(json);
  };

  const getUsersByGroup = async (id: number) => {
    const response = await UserService.getUsersByGroup(id);
    const json = await response.json();
    setUsers(json);
    setGroupClicked(true);
  };

  const handleRowClick = (id: number) => {
    setGroupId(id);
    getUsersByGroup(id);
  };

  useEffect(() => {
    getGroups();
    setUsers([]);
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <h1>Groups:</h1>
        {groups && (
          <GroupOverviewTable groups={groups} onRowClick={handleRowClick} />
        )}

        {groupClicked && (
          <>
            <h1>Users for Group {groupId}:</h1> {}
            {users.length > 0 ? (
              <UserOverviewTable users={users} />
            ) : (
              <p className="missing-users-message">No users yet.</p>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Groups;