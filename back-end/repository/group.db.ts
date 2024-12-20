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
            orderBy: {
                name: 'asc',
            },
        });
        return groupsPrisma.map((groupPrisma) => Group.from(groupPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

/*const getGroupById = async (groupId: number): Promise<Group | null> => {
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
};*/

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
            orderBy: {
                name: 'asc',
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

const getGroupById = async (groupId: number): Promise<Group | null> => {
    try {
        const groupPrisma = await database.group.findUnique({
            where: { id: groupId },
            include: {
                messages: {
                    select: {
                        id: true,
                        content: true,
                        date: true,
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

const createGroup = async (group: Group, lecturerId?: number): Promise<Group> => {
    try {
        const groupPrisma = await database.group.create({
            data: {
                name: group.getName(),
                description: group.getDescription(),
                code: group.getCode(),
                users: lecturerId ? { connect: [{ id: lecturerId }] } : undefined,
            },
        });

        return Group.from(groupPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateGroup = async (groupId: number, group: Group, code: string): Promise<Group> => {
    try {
        const existingGroup = await database.group.findUnique({
            where: { id: groupId },
        });

        const groupPrisma = await database.group.update({
            where: { id: groupId },
            data: {
                name: group.getName(),
                description: group.getDescription(),
                code: code,
            },
        });

        return Group.from(groupPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteGroup = async (groupId: number): Promise<void> => {
    try {
        await database.group.delete({
            where: { id: groupId },
        });
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
    createGroup,
    updateGroup,
    deleteGroup,
};
