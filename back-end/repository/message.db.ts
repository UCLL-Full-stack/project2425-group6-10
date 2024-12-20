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

const getMessageById = async (messageId: number): Promise<Message | null> => {
    try {
        const messagePrisma = await database.message.findUnique({
            where: {
                id: messageId,
            },
        });

        return messagePrisma ? Message.from(messagePrisma) : null;
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
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        return messagesPrisma.map((messagePrisma) =>
            Message.from({
                ...messagePrisma,
                user: messagePrisma.user
                    ? { id: messagePrisma.user.id, username: messagePrisma.user.username }
                    : undefined,
            })
        );
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const sendMessage = async (userId: number, groupId: number, content: string): Promise<Message> => {
    try {
        const messagePrisma = await database.message.create({
            data: {
                userId,
                groupId,
                content,
            },
        });

        return Message.from(messagePrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllMessages,
    getMessagesByGroup,
    sendMessage,
    getMessageById,
};
