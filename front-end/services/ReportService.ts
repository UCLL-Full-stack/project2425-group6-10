const getAllReports = async () => {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/reports", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const createReport = async (messageId: number, description: string) => {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      description,
      messageId,
    }),
  });
};

export default { getAllReports, createReport };
