import { Report } from "../model/report";
import reportDb from "../repository/report.db";

const getAllReports = (): Report[] => reportDb.getAllReports();

export default {
    getAllReports,
};