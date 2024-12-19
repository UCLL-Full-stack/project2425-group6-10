import React, { useEffect, useState } from "react";
import ReportService from "../../services/ReportService";
import { Report } from "../../types";
import ReportTable from "../../components/reports/ReportOverviewTable";
import UnauthorizedAccess from "@/components/users/UnauthorizedAccess";
import Header from "@/components/header";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [isUnauthorized, setIsUnauthorized] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const fetchReports = async () => {
    try {
      const response = await ReportService.getAllReports();
      if (response.status === 401) {
        setIsUnauthorized(true);
      } else if (response.ok) {
        const json = await response.json();
        setReports(json);
      }
    } catch (error) {
      setErrorMessage(t("reports.fetchError"));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLoggedInUser(user);
      fetchReports();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{t("reports.pageTitle")}</title>
        <meta name="description" content={t("reports.pageDescription")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main
        className={`container mx-auto px-6 py-12 ${
          isUnauthorized ? "opacity-50" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6">{t("reports.pageHeading")}</h1>

        {isUnauthorized && <UnauthorizedAccess />}

        {errorMessage && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-500 text-red-700 p-3 rounded mb-4">
            <span>{errorMessage}</span>
          </div>
        )}

        {reports.length > 0 ? (
          <ReportTable
            reports={reports}
            loggedInUserRole={loggedInUser?.role || null}
          />
        ) : (
          <p className="text-gray-600">{t("reports.noReports")}</p>
        )}
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "reports"])),
    },
  };
};

export default ReportsPage;
