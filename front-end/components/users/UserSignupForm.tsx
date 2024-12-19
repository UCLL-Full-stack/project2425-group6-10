import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import classNames from "classnames";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const UserSignupForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const router = useRouter();
  const { t } = useTranslation();

  const clearErrors = () => {
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setStatusMessages([]);
  };

  const validate = (): boolean => {
    let result = true;

    if (!name.trim()) {
      setNameError(t("signup.errors.nameRequired"));
      result = false;
    }

    if (!email.trim()) {
      setEmailError(t("signup.errors.emailRequired"));
      result = false;
    }

    if (!password.trim()) {
      setPasswordError(t("signup.errors.passwordRequired"));
      result = false;
    }

    return result;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) return;

    const user = { username: name, email, password };
    const response = await UserService.signupUser(user);

    if (response.status === 201) {
      setStatusMessages([
        {
          message: t("signup.success"),
          type: "success",
        },
      ]);
      setTimeout(() => router.push("/login"), 2000);
    } else if (response.status === 400) {
      const { message } = await response.json();
      setStatusMessages([{ message, type: "error" }]);
    } else {
      setStatusMessages([
        {
          message: t("signup.errors.general"),
          type: "error",
        },
      ]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
        {t("signup.title")}
      </h3>
      {statusMessages.length > 0 && (
        <div className="mb-4">
          <ul className="list-none space-y-2">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames(
                  "px-4 py-2 rounded-md",
                  type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
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
          <label
            htmlFor="nameInput"
            className="block text-sm font-medium text-gray-700"
          >
            {t("signup.fields.username")}
          </label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("signup.placeholders.username")}
          />
          {nameError && (
            <p className="text-red-600 text-sm mt-1">{nameError}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="emailInput"
            className="block text-sm font-medium text-gray-700"
          >
            {t("signup.fields.email")}
          </label>
          <input
            id="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("signup.placeholders.email")}
          />
          {emailError && (
            <p className="text-red-600 text-sm mt-1">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="passwordInput"
            className="block text-sm font-medium text-gray-700"
          >
            {t("signup.fields.password")}
          </label>
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={t("signup.placeholders.password")}
          />
          {passwordError && (
            <p className="text-red-600 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-all"
        >
          {t("signup.submit")}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4 text-center">
        {t("signup.footer.text")}{" "}
        <a
          href="/login"
          className="text-indigo-600 font-medium hover:underline"
        >
          {t("signup.footer.link")}
        </a>
      </p>
    </div>
  );
};

export default UserSignupForm;
