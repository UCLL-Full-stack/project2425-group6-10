import { User } from '../model/user';
import database from '../util/database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({ include: { groups: true } });
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
            include: { groups: true },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const addGroupToUser = async (userId: number, groupId: number): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            data: {
                groups: {
                    connect: { id: groupId },
                },
            },
            where: { id: userId },
            include: { groups: true },
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
            },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async ({ username, password, email, role }: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username,
                password,
                email,
                role,
            },
            include: { groups: true },
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
            include: { groups: true },
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
            include: { groups: true },
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
