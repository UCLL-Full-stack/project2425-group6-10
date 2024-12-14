import { Role } from '@prisma/client';
import { Group } from '../model/group';
import { User } from '../model/user';
import groupDb from '../repository/group.db';
import userDb from '../repository/user.db';
import { UnauthorizedError } from 'express-jwt';
import { GroupInput } from '../types';

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

const createGroup = async (
    username: string,
    role: Role,
    { name, description }: GroupInput
): Promise<Group> => {
    if (role !== 'admin' && role !== 'lecturer') {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }
    if (!name) {
        throw new Error('Group name is required');
    }
    if (!description) {
        throw new Error('Group description is required');
    }
    const newGroup = new Group({ name, description });
    while ((await groupDb.getGroupByCode(newGroup.getCode())) !== null) {
        newGroup.setCode(newGroup.generateCode());
    }
    let lecturerId: number | undefined;
    if (role === 'lecturer') {
        const lecturer = await userDb.getUserbyUsername(username);
        if (!lecturer) {
            throw new Error('User not found');
        }
        lecturerId = lecturer.id;
    }

    return await groupDb.createGroup(newGroup, lecturerId);
};

export default { getGroups, getGroupById, createGroup };
