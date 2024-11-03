import { User } from "../model/user";
import userDb from "../repository/user.db";
import { UserInput, UserDTO } from "../types"; // Import your DTOs

const getAllUsers = (): UserDTO[] => {
    const users = userDb.getAllUsers();
    return users.map(user => ({
        id: user.getId()!,
        username: user.getUsername(),
        email: user.getEmail(),
        role: user.getRole(),
        groups: user.getGroups().map(group => ({
            id: group.getId()!,
            name: group.getName(),
        })),
    }));
}

const getUserById = (id: number): UserDTO | undefined => {
    const user = userDb.getUserById(id);
    if (!user) {
        return undefined;
    }
    return {
        id: user.getId()!,
        username: user.getUsername(),
        email: user.getEmail(),
        role: user.getRole(),
        groups: user.getGroups().map(group => ({
            id: group.getId()!,
            name: group.getName(),
        })),
    };
}

export default {
    getAllUsers,
    getUserById,
}
