import { User } from "@/types"

type Props = {
    users: Array<User>
}

const UserOverviewTable: React.FC<Props> = ({ users }) => {
    return (
        <>
            <table className="users-table"> 
                <thead className="users-table-header"> 
                    <tr>
                        <th className="users-header-cell">Name</th>
                        <th className="users-header-cell">Email</th>
                        <th className="users-header-cell">Role</th>
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
    )
}

export default UserOverviewTable;
