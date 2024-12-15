import { User } from '../model/user';
import database from '../util/database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            include: { groups: true, messages: true },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
            include: { groups: true, messages: true },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const addGroupToUser = async (username: string, groupCode: string): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            data: {
                groups: {
                    connect: { code: groupCode },
                },
            },
            where: { username: username },
            include: { groups: true, messages: true },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const getUsersByGroupId = async (groupId: number): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            where: {
                groups: {
                    some: {
                        id: groupId,
                    },
                },
            },
            include: {
                groups: true,
                messages: true,
            },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.getPassword(),
                email: user.getEmail(),
                role: user.getRole(),
            },
            include: { groups: true, messages: true },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserbyUsername = async (username: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
            include: { groups: true, messages: true },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserbyEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { email },
            include: { groups: true, messages: true },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllUsers,
    getUserById,
    addGroupToUser,
    getUsersByGroupId,
    createUser,
    getUserbyUsername,
    getUserbyEmail,
};
