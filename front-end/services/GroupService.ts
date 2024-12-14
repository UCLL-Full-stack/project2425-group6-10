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

const GroupService = {
  getAllGroups,
  getGroupById,
  getMessagesByGroupId,
  createGroup,
};

export default GroupService;
