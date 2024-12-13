import { User } from "@/types";
import { group } from "console";
import { get } from "http";

const getUsersByGroup = async (id: number) => {
  //const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  return await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/group/" + id, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
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

const signupUser = (user: {
  username: string;
  email: string;
  password: string;
}) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};

const addGroupToUser = async (username: string, groupCode: string) => {
  //const token = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).token : null;

  const url = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/groups/${groupCode}`;

  return await fetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const UserService = {
  getUsersByGroup,
  loginUser,
  signupUser,
  addGroupToUser,
};

export default UserService;
