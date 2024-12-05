import { get } from 'http';
import { Message } from '../model/message';
import database from '../util/database';

const getAllMessages = async (): Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany();
        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllMessages,
};
