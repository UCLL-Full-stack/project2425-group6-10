import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";

const UserLoginForm: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();

  const clearErrors = () => {
    setNameError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!name.trim()) {
      setNameError("Name is required.");
      result = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      result = false;
    }

    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) return;

    const user = { username: name, password };
    const response = await UserService.loginUser(user);

    if (response.status === 200) {
      setStatusMessages([{ message: "Login successful. Redirecting to homepage...", type: "success" }]);
      const user = await response.json();

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          token: user.token,
          username: user.username,
          role: user.role,
        })
      );

      setTimeout(() => router.push("/"), 2000);
    } else if (response.status === 400) {
      const { message } = await response.json();
      setStatusMessages([{ message: message, type: "error" }]);
    } else {
      setStatusMessages([{ message: "General error. Please try again later.", type: "error" }]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h3>
      {statusMessages.length > 0 && (
        <div className="mb-4">
          <ul className="list-none space-y-2">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames(
                  "px-4 py-2 rounded-md",
                  type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                )}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-4">
          <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your username"
          />
          {nameError && <p className="text-red-600 text-sm mt-1">{nameError}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label htmlFor="passwordInput" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
          {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-all"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Don't have an account?{" "}
        <a href="/signup" className="text-indigo-600 font-medium hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default UserLoginForm;