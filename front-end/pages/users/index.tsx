import { useRouter } from "next/router";
import Header from "@/components/header";
import UserOverview from "@/components/users/UserOverview";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{t("users.pageTitle")}</title>
      </Head>
      <Header />
      <main className="container mx-auto h-[calc(100vh-4rem)] px-6 py-6">
        <UserOverview />
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default UsersPage;
