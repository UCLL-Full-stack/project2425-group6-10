import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types";
import Language from "./language/Language";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);

    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold tracking-wide">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            {t("header.logo")}
          </Link>
        </div>

        <ul className="flex items-center space-x-4">
          {loggedInUser && loggedInUser.role === "admin" && (
            <>
              <li>
                <Link
                  href="/users"
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500 transition-all"
                >
                  {t("header.admin.userOverview")}
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500 transition-all"
                >
                  {t("header.admin.reportOverview")}
                </Link>
              </li>
            </>
          )}
          {loggedInUser && (
            <>
              <li>
                <Link
                  href="/groups"
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500 transition-all"
                >
                  {t("header.groups")}
                </Link>
              </li>
            </>
          )}
          {!loggedInUser && (
            <>
              <li>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-white text-indigo-500 font-semibold rounded-lg shadow hover:shadow-lg hover:bg-indigo-100 transition-all"
                >
                  {t("header.guest.signup")}
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-purple-600 font-semibold rounded-lg shadow hover:shadow-lg hover:bg-purple-700 transition-all"
                >
                  {t("header.guest.login")}
                </Link>
              </li>
            </>
          )}
          {loggedInUser && (
            <>
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 font-semibold rounded-lg shadow hover:shadow-lg hover:bg-red-600 transition-all"
                >
                  {t("header.logout")}
                </button>
              </li>
              <li>
                <span className="text-sm bg-gray-800 px-3 py-1 rounded-lg">
                  {loggedInUser.username}
                </span>
              </li>
            </>
          )}
          <Language />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
