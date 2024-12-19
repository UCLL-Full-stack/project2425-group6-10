import Head from "next/head";
import Image from "next/image";
import Header from "@/components/header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>CampusChat</title>
        <meta name="description" content={t("home.meta.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="min-h-screen bg-gray-100">
        {/* Welcome section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">
            {t("home.welcome.title")}{" "}
            <span className="text-indigo-600">{t("home.brand")}</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            {t("home.welcome.subtitle")}
          </p>

          <div className="mt-12 flex justify-center">
            <Image
              className="rounded-lg shadow-lg"
              src="/campuschatbanner.webp"
              width={533}
              height={300}
              alt={t("home.banner.alt")}
            />
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 space-x-4">
            <a
              href="/signup"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              {t("home.cta.getStarted")}
            </a>
            <a
              href="/groups"
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition-all"
            >
              {t("home.cta.exploreGroups")}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = async (context: { locale: any }) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};
