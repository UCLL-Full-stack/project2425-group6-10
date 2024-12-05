import { User } from '../model/user';
import groupDb from '../repository/group.db';
import userDb from '../repository/user.db';

const getAllUsers = (): Promise<User[]> => {
    const users = userDb.getAllUsers();
    return users;
};

const getUserById = (id: number): Promise<User | null> => {
    const user = userDb.getUserById(id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    return user;
};

const addGroupToUser = (userId: number, groupId: number): Promise<User> => {
    if (!userId || !groupId) {
        throw new Error('Userid is required');
    }
    if (!groupId) {
        throw new Error('Groupid is required');
    }

    if (!userDb.getUserById(userId)) {
        throw new Error(`User with id ${userId} not found`);
    }

    if (!groupDb.getGroupById(groupId)) {
        throw new Error(`Group with id ${groupId} not found`);
    }

    const user = userDb.addGroupToUser(userId, groupId);
    return user;
};

export default {
    getAllUsers,
    getUserById,
    addGroupToUser,
};
