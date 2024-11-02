import exp from "constants";
import { Report } from "../model/report";

const reports = [
    new Report({description: 'Insulting messages'}),
    new Report({description: 'Spam'}),
]

const getAllReports = (): Report[] => {
    return reports;
}

export default {
    getAllReports,
}