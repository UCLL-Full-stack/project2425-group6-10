import { Report } from '../../model/report';
import reportDb from '../../repository/report.db';
import reportService from '../../service/report.service';

const reports = [
    new Report({description: 'Insulting messages'}),
    new Report({description: 'Spam'}),
]

let mockReportDbGetAllReports: jest.Mock;

beforeEach(() => {
    mockReportDbGetAllReports = jest.fn();    
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of reports, when getAllReports, then: list of reports is returned', () => {
    reportDb.getAllReports = mockReportDbGetAllReports.mockReturnValue(reports);

    reportService.getAllReports();

    expect(mockReportDbGetAllReports).toHaveBeenCalledTimes(1);
    expect(mockReportDbGetAllReports).toHaveReturnedWith(reports);
});