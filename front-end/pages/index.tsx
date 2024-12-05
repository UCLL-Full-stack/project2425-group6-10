import Head from "next/head";
import Image from "next/image";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <h1>CampusChat</h1>
        <div className="image-container">
          <Image
            className="HomeLogo"
            src="/logo.jpg"
            width={300}
            height={300}
            alt="Campus Chat Logo"
          />
        </div>
      </main>
    </>
  );
}
