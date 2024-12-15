import React, { useEffect, useState } from "react";
import UserService from "@/services/UserService";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import { User } from "@/types";

const UserOverview: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selfRoleChange, setSelfRoleChange] = useState<{
    username: string;
    newRole: string;
  } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAllUsers();
      if (response.status === 401) {
        setIsUnauthorized(true);
      } else if (response.ok) {
        const fetchedUsers = await response.json();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (username: string, newRole: string) => {
    if (loggedInUser?.username === username) {
      setSelfRoleChange({ username, newRole });
      setIsConfirmationOpen(true);
      return;
    }

    updateRole(username, newRole);
  };

  const updateRole = async (username: string, newRole: string) => {
    try {
      const response = await UserService.updateUserRole(username, newRole);
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.username === username ? { ...user, role: newRole } : user
          )
        );
      } else {
        alert("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const updateFilteredUsers = (query: string, roles: string[]) => {
    const lowercasedQuery = query.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          (roles.length === 0 || roles.includes(user.role!)) &&
          (user.username?.toLowerCase().includes(lowercasedQuery) ||
            user.email?.toLowerCase().includes(lowercasedQuery))
      )
    );
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const updateFilteredUsers = () => {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            (selectedRoles.length === 0 ||
              selectedRoles.includes(user.role!)) &&
            (user.username?.toLowerCase().includes(lowercasedQuery) ||
              user.email?.toLowerCase().includes(lowercasedQuery))
        )
      );
    };

    updateFilteredUsers();
  }, [users, searchQuery, selectedRoles]);

  if (isUnauthorized) {
    return <UnauthorizedAccess />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">User Overview</h1>
      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username or email..."
          className="flex-1 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => setIsFilterOpen(true)}
          className="ml-4 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
        >
          Filter Roles
        </button>
      </div>
      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Filter Roles
            </h2>
            <div className="space-y-3">
              {["student", "lecturer", "admin"].map((role) => (
                <div key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    id={role}
                    checked={selectedRoles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRoles((prev) => [...prev, role]);
                      } else {
                        setSelectedRoles((prev) =>
                          prev.filter((r) => r !== role)
                        );
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={role} className="text-gray-700 capitalize">
                    {role}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  updateFilteredUsers(searchQuery, selectedRoles);
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      {isConfirmationOpen && selfRoleChange && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Warning</h2>
            <p className="text-gray-700 mb-4">
              You are about to change your own role to{" "}
              <span className="font-bold capitalize">
                {selfRoleChange.newRole}
              </span>
              . This might limit your access. Are you sure?
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateRole(selfRoleChange.username, selfRoleChange.newRole);
                  setIsConfirmationOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Table */}
      <div className="overflow-y-auto max-h-[400px] border rounded-lg shadow">
        <table className="min-w-full bg-gray-50">
          <thead className="bg-indigo-100 text-indigo-700 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Username</th>
              <th className="px-6 py-3 text-left font-semibold">Email</th>
              <th className="px-6 py-3 text-left font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.username} className="hover:bg-indigo-50 transition">
                <td className="px-6 py-3 border-b">{user.username}</td>
                <td className="px-6 py-3 border-b">{user.email}</td>
                <td className="px-6 py-3 border-b">
                  <select
                    className="border rounded px-3 py-2"
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.username!, e.target.value)
                    }
                  >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="text-center text-gray-600 mt-4">
            No users found matching the criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
