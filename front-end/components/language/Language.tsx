import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const newLocale = event.target.value;
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="ml-4">
      <label htmlFor="language" className="sr-only">
        {t("language")}
      </label>
      <select
        id="language"
        className="bg-white text-indigo-500 font-semibold rounded-lg shadow hover:shadow-lg transition-all p-2"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>
    </div>
  );
};

export default Language;
