import Header from "@/components/header";
import UserSignupForm from "@/components/users/UserSignupForm";
import Head from "next/head";

const Signup: React.FC = () => {
  return (
    <>
      <Head>
        <title>User Signup</title>
        <meta name="description" content="Sign up for CampusChat to connect and collaborate effortlessly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-100 px-6">
        <UserSignupForm />
      </main>
    </>
  );
};

export default Signup;