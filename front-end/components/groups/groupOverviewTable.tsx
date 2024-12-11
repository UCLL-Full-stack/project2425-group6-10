import { Group } from "@/types";

type Props = {
  groups: Array<Group>;
  onRowClick: (id: number) => void;
};

const GroupOverviewTable: React.FC<Props> = ({ groups, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Code</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr
              key={group.id}
              className="cursor-pointer hover:bg-gray-50 transition"
              onClick={() => onRowClick(group.id)}
            >
              <td className="px-4 py-2 border-b">{group.name}</td>
              <td className="px-4 py-2 border-b">{group.description}</td>
              <td className="px-4 py-2 border-b">{group.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupOverviewTable;
