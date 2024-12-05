import { group } from "console";
import { get } from "http";

const getUsersByGroup = async (id: number) => {
  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/group/" + id, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
};

const GroupService = {
  getUsersByGroup,
};

export default GroupService;
