import Header from "@/components/header";
import UserLoginForm from "@/components/users/UserLoginForm";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const Login: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("login.title")}</title>
        <meta name="description" content="Login to CampusChat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 px-6">
        <UserLoginForm />
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
export default Login;
