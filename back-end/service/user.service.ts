import { User } from '../model/user';
import groupDb from '../repository/group.db';
import userDb from '../repository/user.db';
import bcrypt from 'bcrypt';
import { UserInput, AuthenticationResponse } from '../types';
import { generateJwtToken } from '../util/jwt';
import { Role } from '@prisma/client';
import { UnauthorizedError } from 'express-jwt/dist/errors/UnauthorizedError';

const getAllUsers = async (role: Role): Promise<User[]> => {
    if (role !== 'admin') {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }

    const users = await userDb.getAllUsers();
    return users;
};

const getUserById = async (id: number): Promise<User | null> => {
    const user = await userDb.getUserById(id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    return user;
};

const addGroupToUser = async (username: string, groupCode: string): Promise<User> => {
    if (!(await userDb.getUserbyUsername(username))) {
        throw new Error(`User ${username} not found`);
    }
    if (!groupCode) {
        throw new Error('Group code is required');
    }
    if (!username) {
        throw new Error('User id is required');
    }
    if (!(await groupDb.getGroupByCode(groupCode))) {
        throw new Error(`Group with code ${groupCode} not found`);
    }
    const user = await userDb.addGroupToUser(username, groupCode);
    return user;
};

const getUsersByGroupId = async (groupId: number): Promise<User[]> => {
    if (!groupDb.getGroupById(groupId)) {
        throw new Error(`Group with id ${groupId} not found`);
    }
    const users = await userDb.getUsersByGroupId(groupId);
    return users;
};

const createUser = async ({ username, email, password }: UserInput): Promise<User> => {
    if (username === undefined) {
        throw new Error('Username is required');
    }
    if (email === undefined) {
        throw new Error('Email is required');
    }
    if (password === undefined) {
        throw new Error('Password is required');
    }
    const existingUser = await userDb.getUserbyUsername(username);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
        role: 'student',
    });
    await userDb.createUser(user);
    return user;
};

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    if (username === null || username === undefined) {
        throw new Error('Username is required');
    }
    if (!password === null || password === undefined) {
        throw new Error('Password is required');
    }
    const user = await userDb.getUserbyUsername(username);
    if (!user) {
        throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.getPassword());

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }
    return {
        token: generateJwtToken({ username, role: user.getRole() }),
        username: username,
        role: user.getRole(),
    };
};

const updateUserRole = async (role: Role, username: string, newRole: Role): Promise<User> => {
    if (role !== 'admin') {
        throw new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        });
    }

    if (!['admin', 'student', 'lecturer'].includes(newRole)) {
        throw new Error('Invalid role provided.');
    }

    const userToUpdate = await userDb.getUserbyUsername(username);
    if (!userToUpdate) {
        throw new Error(`User with username ${username} not found.`);
    }

    return await userDb.updateUserRole(username, newRole);
};

export default {
    getAllUsers,
    getUserById,
    addGroupToUser,
    getUsersByGroupId,
    createUser,
    authenticate,
    updateUserRole,
};
