import { User } from '../model/user';
import groupDb from '../repository/group.db';
import userDb from '../repository/user.db';
import bcrypt from 'bcrypt';
import { UserInput, AuthenticationResponse } from '../types';
import { generateJwtToken } from '../util/jwt';

const getAllUsers = async (): Promise<User[]> => {
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

const addGroupToUser = async (userId: number, groupId: number): Promise<User> => {
    if (!userDb.getUserById(userId)) {
        throw new Error(`User with id ${userId} not found`);
    }

    if (!groupDb.getGroupById(groupId)) {
        throw new Error(`Group with id ${groupId} not found`);
    }

    const user = await userDb.addGroupToUser(userId, groupId);
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
        groups: [],
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

export default {
    getAllUsers,
    getUserById,
    addGroupToUser,
    getUsersByGroupId,
    createUser,
    authenticate,
};
