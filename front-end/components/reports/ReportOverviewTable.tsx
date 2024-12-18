import React from "react";
import { Report } from "../../types";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";

type ReportTableProps = {
  reports: Report[];
  loggedInUserRole: string | null; // Add loggedInUserRole prop
};

const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  loggedInUserRole,
}) => {
  // Check if the user has the correct role
  if (loggedInUserRole !== "admin" && loggedInUserRole !== "manager") {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="overflow-x-auto max-h-[500px] md:max-h-screen">
      <table className="min-w-full bg-white shadow-md rounded-lg table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Report Sender</th>
            <th className="px-4 py-2 text-left">Message content</th>
            <th className="px-4 py-2 text-left">Message Sender</th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto max-h-[400px]">
          {reports.map((report) => (
            <tr
              key={report.id}
              className="transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-2 border-b break-words">
                {report.description}
              </td>
              <td className="px-4 py-2 border-b">
                {report.date ? new Date(report.date).toLocaleString() : "N/A"}
              </td>
              <td className="px-4 py-2 border-b">{report.username}</td>
              <td className="px-4 py-2 border-b">{report.message}</td>
              <td className="px-4 py-2 border-b">{report.messageUser}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
