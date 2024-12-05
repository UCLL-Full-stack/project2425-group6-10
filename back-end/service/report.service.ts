import { Report } from '../model/report';
import reportDb from '../repository/report.db';

const getAllReports = async (): Promise<Report[]> => await reportDb.getAllReports();

export default {
    getAllReports,
};
