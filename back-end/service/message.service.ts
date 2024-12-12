import { Message } from '../model/message';
import groupDb from '../repository/group.db';
import messageDb from '../repository/message.db';

const getAllMessages = async (): Promise<Message[]> => await messageDb.getAllMessages();

const getMessagesByGroup = async (groupId: number): Promise<Message[]> => {
    const exists = await groupDb.getGroupById(groupId);
    if (!exists) throw new Error('Group not found.');

    return await messageDb.getMessagesByGroup(groupId);
};
export default {
    getAllMessages,
    getMessagesByGroup,
};
