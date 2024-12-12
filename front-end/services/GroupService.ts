const getAllGroups = async (username: string, role: string) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/groups", {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const GroupService = {
  getAllGroups,
};

export default GroupService;
