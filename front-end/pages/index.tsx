import Head from "next/head";
import Image from "next/image";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Head>
        <title>CampusChat</title>
        <meta name="description" content="CampusChat home page." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-100">
        {/* Welcome section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">
            Welcome to <span className="text-indigo-600">CampusChat</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Your go-to platform for seamless communication, collaboration, and connection.
          </p>

          <div className="mt-12 flex justify-center">
            <Image
              className="rounded-lg shadow-lg"
              src="/logo.jpg"
              width={300}
              height={300}
              alt="Campus Chat Logo"
            />
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 space-x-4">
            <a
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              Get Started
            </a>
            <a
              href="/groups"
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-all"
            >
              Explore Groups
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
