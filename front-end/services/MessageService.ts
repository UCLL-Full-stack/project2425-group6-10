import exp from "constants";

const sendMessage = async (groupId: number, content: string) => {
  const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;

  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ groupId, content }),
  });
};

export default {
  sendMessage,
};
