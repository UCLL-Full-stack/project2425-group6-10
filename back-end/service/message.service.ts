import { Message } from '../model/message';
import messageDb from '../repository/message.db';

const getAllMessages = async (): Promise<Message[]> => await messageDb.getAllMessages();

export default {
    getAllMessages,
};
