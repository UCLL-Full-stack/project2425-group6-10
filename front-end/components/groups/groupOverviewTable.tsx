import { Group } from "@/types";

type Props = {
  groups: Array<Group>;
  onRowClick: (id: number) => void;
};

const GroupOverviewTable: React.FC<Props> = ({ groups, onRowClick }) => {
  return (
    <>
      <table className="groups-table">
        <thead className="group-table-header">
          <tr>
            <th className="group-header-cell">Name</th>
            <th className="group-header-cell">Description</th>
            <th className="group-header-cell">Code</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr
              key={index}
              className="group-table-row"
              onClick={() => onRowClick(group.id)}
            >
              <td className="group-cell">{group.name}</td>
              <td className="group-cell">{group.description}</td>
              <td className="group-cell">{group.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GroupOverviewTable;
