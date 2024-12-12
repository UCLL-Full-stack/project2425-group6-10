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

const getMessagesByGroup = async (groupId: number): Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({
            where: {
                group: {
                    id: groupId,
                },
            },
        });
        return messagesPrisma.map((messagePrisma) => Message.from(messagePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllMessages,
    getMessagesByGroup,
};
