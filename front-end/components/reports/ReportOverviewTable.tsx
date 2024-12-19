import React from "react";
import { Report } from "../../types";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import { useTranslation } from "next-i18next";

type ReportTableProps = {
  reports: Report[];
  loggedInUserRole: string | null;
};

const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  loggedInUserRole,
}) => {
  const { t } = useTranslation();

  if (loggedInUserRole !== "admin" && loggedInUserRole !== "manager") {
    return <UnauthorizedAccess />;
  }

  return (
    <div className="overflow-x-auto max-h-[500px] md:max-h-screen">
      <table className="min-w-full bg-white shadow-md rounded-lg table-auto">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">
              {t("reportTable.description")}
            </th>
            <th className="px-4 py-2 text-left">{t("reportTable.date")}</th>
            <th className="px-4 py-2 text-left">
              {t("reportTable.reportSender")}
            </th>
            <th className="px-4 py-2 text-left">
              {t("reportTable.messageContent")}
            </th>
            <th className="px-4 py-2 text-left">
              {t("reportTable.messageSender")}
            </th>
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
                {report.date
                  ? new Date(report.date).toLocaleString()
                  : t("reportTable.na")}
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
