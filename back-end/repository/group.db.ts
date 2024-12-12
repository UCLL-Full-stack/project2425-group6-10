import exp from 'constants';
import { Group } from '../model/group';
import userDb from './user.db';
import { User } from '../model/user';
import database from '../util/database';
import { te, tr } from 'date-fns/locale';

const getAllGroups = async (): Promise<Group[]> => {
    try {
        const groupsPrisma = await database.group.findMany({
            include: {
                users: true,
            },
        });
        return groupsPrisma.map((groupPrisma) => Group.from(groupPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getGroupById = async (groupId: number): Promise<Group | null> => {
    try {
        const groupPrisma = await database.group.findUnique({
            where: { id: groupId },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return groupPrisma ? Group.from(groupPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getGroupsByUsername = async (username: string): Promise<Group[]> => {
    try {
        const groupsPrisma = await database.group.findMany({
            where: {
                users: {
                    some: {
                        username: username,
                    },
                },
            },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return groupsPrisma.map((groupPrisma) => Group.from(groupPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getGroupByCode = async (code: string): Promise<Group | null> => {
    try {
        const groupPrisma = await database.group.findUnique({
            where: { code },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return groupPrisma ? Group.from(groupPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllGroups,
    getGroupById,
    getGroupsByUsername,
    getGroupByCode,
};
