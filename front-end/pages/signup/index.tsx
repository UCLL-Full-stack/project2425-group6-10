import Header from "@/components/header";
import UserSignupForm from "@/components/users/UserSignupForm";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

const Signup: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("signup.title")}</title>
        <meta name="description" content="Sign up for CampusChat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 px-6">
        <UserSignupForm />
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

export default Signup;
