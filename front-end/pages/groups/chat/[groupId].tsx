import { useRouter } from "next/router";
import Header from "@/components/header";
import GroupChat from "@/components/groups/GroupChat";
import Head from "next/head";

const ChatPage: React.FC = () => {
  const router = useRouter();
  const { groupId } = router.query;

  if (!groupId) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Group Chat</title>
      </Head>
      <Header />
      <main className="container mx-auto h-[calc(100vh-4rem)] px-6 py-6">
        <GroupChat groupId={Number(groupId)} />
      </main>
    </>
  );
};

export default ChatPage;
