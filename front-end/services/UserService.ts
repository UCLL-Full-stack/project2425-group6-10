import { User } from "@/types";
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

const loginUser = (user: User) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
  });
};

const signupUser = (user: { username: string; email: string; password: string }) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const UserService = {
  getUsersByGroup,
  loginUser,
  signupUser,
};

export default UserService;