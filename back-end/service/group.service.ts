import { Role } from '@prisma/client';
import { Group } from '../model/group';
import { User } from '../model/user';
import groupDb from '../repository/group.db';
import userDb from '../repository/user.db';
import { UnauthorizedError } from 'express-jwt';

const getGroups = async (username: string, role: Role): Promise<Group[]> => {
    if (role === 'admin') {
        return await groupDb.getAllGroups();
    }
    if (role === 'student' || role === 'lecturer') {
        return await groupDb.getGroupsByUsername(username);
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
};

const getGroupById = async (groupId: number): Promise<Group | null> => {
    return await groupDb.getGroupById(groupId);
};

export default { getGroups, getGroupById };
