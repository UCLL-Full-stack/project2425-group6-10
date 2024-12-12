import { Message } from '../model/message';
import groupDb from '../repository/group.db';
import messageDb from '../repository/message.db';
import userDb from '../repository/user.db';

const getAllMessages = async (): Promise<Message[]> => await messageDb.getAllMessages();

const getMessagesByGroup = async (username: string, groupId: number): Promise<Message[]> => {
    const exists = await groupDb.getGroupById(groupId);
    if (!exists) throw new Error('Group not found.');
    const groups = await groupDb.getGroupsByUsername(username);
    if (!groups.find((group) => group.id === groupId)) {
        throw new Error('You are not a member of this group.');
    }
    return await messageDb.getMessagesByGroup(groupId);
};
export default {
    getAllMessages,
    getMessagesByGroup,
};
