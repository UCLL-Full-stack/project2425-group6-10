const getAllGroups = async () => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/groups", {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getGroupById = async (id: number) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getMessagesByGroupId = async (groupId: number) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/group/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const GroupService = {
  getAllGroups,
  getGroupById,
  getMessagesByGroupId,
};

export default GroupService;
