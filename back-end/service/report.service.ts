import { Role } from '@prisma/client';
import { Report } from '../model/report';
import messageDb from '../repository/message.db';
import reportDb from '../repository/report.db';
import userDb from '../repository/user.db';

const getAllReports = async (role: Role): Promise<Report[]> => {
    if (role !== 'admin') {
        throw new Error('You are not authorized to access this resource.');
    }
    return await reportDb.getAllReports();
};

const createReport = async (
    username: string,
    messageId: number,
    description: string
): Promise<Report> => {
    if (!description) {
        throw new Error('Description is required.');
    }
    if (!messageId) {
        throw new Error('Message ID is required.');
    }
    if (!username) {
        throw new Error('User ID is required.');
    }
    const user = await userDb.getUserbyUsername(username);
    if (!user) {
        throw new Error('User not found.');
    }
    if (!(await messageDb.getMessageById(messageId))) {
        throw new Error('Message not found.');
    }
    const id = user.getId();
    if (id === undefined) {
        throw new Error('Username is required.');
    }
    return reportDb.createReport(description, messageId, id);
};

export default {
    getAllReports,
    createReport,
};
