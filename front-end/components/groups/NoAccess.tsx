import React from "react";
import { useRouter } from "next/router";

const UnauthorizedAccess: React.FC = () => {
  const router = useRouter();

  const handleGroupRedirect = () => {
    router.push("/groups");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">No Access</h2>
        <p className="text-gray-600 mb-6">
          You don't have access to this group. Please click the button below to go back to the group page.
        </p>
        <button
          onClick={handleGroupRedirect}
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 transition-all"
        >
          Group Overview
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
