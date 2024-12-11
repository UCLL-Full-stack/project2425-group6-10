import Header from "@/components/header";
import UserLoginForm from "@/components/users/UserLoginForm";
import Head from "next/head";

const Login: React.FC = () => {
  return (
    <>
      <Head>
        <title>User Login</title>
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

export default Login;
