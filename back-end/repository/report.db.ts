import { Report } from '../model/report';
import database from '../util/database';

const getAllReports = async (): Promise<Report[]> => {
    try {
        const reportsPrisma = await database.report.findMany({
            include: {
                user: true,
                message: { include: { user: true } },
            },
        });

        return reportsPrisma.map((reportPrisma) => {
            const report = Report.from(reportPrisma);
            const reportWithUsername = {
                ...report,
                username: reportPrisma.user.username,
                message: reportPrisma.message.content,
                messageUser: reportPrisma.message.user?.username,
            };

            return reportWithUsername as unknown as Report;
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createReport = async (
    description: string,
    messageId: number,
    userId: number
): Promise<Report> => {
    try {
        const reportPrisma = await database.report.create({
            data: {
                description,
                messageId,
                userId,
            },
        });
        return Report.from(reportPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllReports,
    createReport,
};
