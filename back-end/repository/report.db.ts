import { Report } from '../model/report';
import database from '../util/database';

const getAllReports = async (): Promise<Report[]> => {
    try {
        const reportsPrisma = await database.report.findMany();
        return reportsPrisma.map((reportPrisma) => Report.from(reportPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllReports,
};
