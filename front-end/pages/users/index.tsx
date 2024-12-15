import { useRouter } from "next/router";
import Header from "@/components/header";
import UserOverview from "@/components/users/UserOverview";
import Head from "next/head";

const UsersPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>User Overview</title>
      </Head>
      <Header />
      <main className="container mx-auto h-[calc(100vh-4rem)] px-6 py-6">
        <UserOverview />
      </main>
    </>
  );
};

export default UsersPage;
