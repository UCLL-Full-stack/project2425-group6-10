import { useRouter } from "next/router";
import Header from "@/components/header";
import GroupChat from "@/components/groups/GroupChat";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { groupId } = router.query;
  const { t } = useTranslation();

  if (!groupId || isNaN(Number(groupId))) {
    return <p>{t("chatPage.error.invalidGroupId")}</p>;
  }

  return (
    <>
      <Head>
        <title>{t("chatPage.title")}</title>
        <meta name="description" content={t("chatPage.description")} />
      </Head>
      <Header />
      <main className="container mx-auto h-[calc(100vh-4rem)] px-6 py-6">
        <GroupChat groupId={Number(groupId)} />
      </main>
    </>
  );
};

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "chatPage"])),
    },
  };
};

export default ChatPage;
