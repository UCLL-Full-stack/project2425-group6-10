import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types";

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    // Clear all draft messages
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("draftMessage_group_")) {
        localStorage.removeItem(key);
      }
    });

    setLoggedInUser(null);
    window.location.reload();
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo eventueel nog */}
        <div className="text-2xl font-extrabold tracking-wide">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            CampusChat
          </Link>
        </div>

        <ul className="flex items-center space-x-4">
          {/* User Overview */}
          {loggedInUser && loggedInUser.role === "admin" && (
            <>
              <li>
                <Link
                  href="/users"
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500 transition-all"
                >
                  User Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500 transition-all"
                >
                  Report Overview
                </Link>
              </li>
            </>
          )}
          {/* Navigation */}
          {loggedInUser && (
            <>
              <li>
                <Link
                  href="/groups"
                  className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-purple-500 transition-all"
                >
                  Groups
                </Link>
              </li>
            </>
          )}
          {/* User */}
          {!loggedInUser && (
            <>
              <li>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-white text-indigo-500 font-semibold rounded-lg shadow hover:shadow-lg hover:bg-indigo-100 transition-all"
                >
                  Signup
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-purple-600 font-semibold rounded-lg shadow hover:shadow-lg hover:bg-purple-700 transition-all"
                >
                  Login
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
                  Logout
                </button>
              </li>
              <li>
                <span className="text-sm bg-gray-800 px-3 py-1 rounded-lg">
                  {loggedInUser.username}
                </span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
