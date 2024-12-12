import { Role } from '@prisma/client';
import { Message } from '../model/message';
import groupDb from '../repository/group.db';
import messageDb from '../repository/message.db';
import userDb from '../repository/user.db';

const getAllMessages = async (): Promise<Message[]> => await messageDb.getAllMessages();

const getMessagesByGroup = async (
    username: string,
    groupId: number,
    role: Role
): Promise<Message[]> => {
    const exists = await groupDb.getGroupById(groupId);
    if (!exists) throw new Error('Group not found.');

    if (role === 'admin') {
        return await messageDb.getMessagesByGroup(groupId);
    }

    const groups = await groupDb.getGroupsByUsername(username);
    if (!groups.find((group) => group.id === groupId)) {
        throw new Error('You are not a member of this group.');
    }

    return await messageDb.getMessagesByGroup(groupId);
};

const sendMessage = async (
    username: string,
    groupId: number,
    content: string
): Promise<Message> => {
    const user = await userDb.getUserbyUsername(username);
    if (!user) throw new Error('User not found.');

    const group = await groupDb.getGroupById(groupId);
    if (!group) throw new Error('Group not found.');

    const userId = user.getId();
    if (userId === undefined) throw new Error('User ID is undefined.');

    const message = await messageDb.sendMessage(userId, groupId, content);
    return message;
};
export default {
    getAllMessages,
    getMessagesByGroup,
    sendMessage,
};
