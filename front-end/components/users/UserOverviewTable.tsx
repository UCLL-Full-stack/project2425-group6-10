import { User } from "@/types";
import { useTranslation } from "next-i18next";

type Props = {
  users: Array<User>;
};

const UserOverviewTable: React.FC<Props> = ({ users }) => {
  const { t } = useTranslation();

  return (
    <>
      <table className="users-table">
        <thead className="users-table-header">
          <tr>
            <th className="users-header-cell">{t("userOverview.name")}</th>
            <th className="users-header-cell">{t("userOverview.email")}</th>
            <th className="users-header-cell">{t("userOverview.role")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="user-table-row">
              <td className="users-cell">{user.username}</td>
              <td className="users-cell">{user.email}</td>
              <td className="users-cell">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserOverviewTable;
