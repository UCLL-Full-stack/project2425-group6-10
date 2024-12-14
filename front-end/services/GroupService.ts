const getAllGroups = async () => {
  //const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/groups", {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getGroupById = async (id: number) => {
  //const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getMessagesByGroupId = async (groupId: number) => {
  //const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/messages/group/${groupId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const createGroup = async (name: string, description: string) => {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
};

const updateGroup = async (
  groupId: number,
  name: string,
  description: string,
  regenerateCode: boolean
) => {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      regenerateCode, // This will be sent to the backend
    }),
  });
};

const GroupService = {
  getAllGroups,
  getGroupById,
  getMessagesByGroupId,
  createGroup,
  updateGroup,
};

export default GroupService;
