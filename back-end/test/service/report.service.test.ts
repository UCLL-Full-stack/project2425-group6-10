import { Role } from '@prisma/client';
import { Report } from '../../model/report';
import reportDb from '../../repository/report.db';
import reportService from '../../service/report.service';
import userDb from '../../repository/user.db';
import messageDb from '../../repository/message.db';
import { Message } from '../../model/message';
import { User } from '../../model/user';

const reports = [
    new Report({ description: 'Insulting messages' }),
    new Report({ description: 'Spam' }),
];

const messages = [
    new Message({ id: 1, content: 'Test message 1' }),
    new Message({ id: 2, content: 'Test message 2' }),
];

const users = [
    new User({
        id: 1,
        username: 'johnDoe',
        email: 'test@email.com',
        password: 'john1234',
        role: 'student',
    }),
    new User({
        id: 2,
        username: 'janeDoe',
        email: 'test2@email.com',
        password: 'jane1234',
        role: 'student',
    }),
];

let mockReportDbGetAllReports: jest.Mock;
let mockReportDbCreateReport: jest.Mock;
let mockUserDbGetUserByUsername: jest.Mock;
let mockMessageDbGetMessageById: jest.Mock;

beforeEach(() => {
    mockReportDbGetAllReports = jest.fn();
    mockReportDbCreateReport = jest.fn();
    mockUserDbGetUserByUsername = jest.fn();
    mockMessageDbGetMessageById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of reports, when getAllReports, then: list of reports is returned', () => {
    reportDb.getAllReports = mockReportDbGetAllReports.mockReturnValue(reports);
    const role = 'admin';
    reportService.getAllReports(role);

    expect(mockReportDbGetAllReports).toHaveBeenCalledTimes(1);
    expect(mockReportDbGetAllReports).toHaveReturnedWith(reports);
});

test('given: empty list of reports, when getAllReports, then: empty list of reports is returned', () => {
    reportDb.getAllReports = mockReportDbGetAllReports.mockReturnValue([]);
    const role = 'admin';
    reportService.getAllReports(role);

    expect(mockReportDbGetAllReports).toHaveBeenCalledTimes(1);
    expect(mockReportDbGetAllReports).toHaveReturnedWith([]);
});

test('given: list of reports, when getAllReports as unauthorized user, then: error is thrown', async () => {
    reportDb.getAllReports = mockReportDbGetAllReports.mockReturnValue(reports);
    const role = 'student';

    await expect(reportService.getAllReports(role)).rejects.toThrow(
        'You are not authorized to access this resource'
    );
});

test('given valid input, when createReport, then report is created', async () => {
    const username = 'johnDoe';
    const messageId = 1;
    const description = 'Test report description';

    mockUserDbGetUserByUsername.mockResolvedValue(users[0]);
    mockMessageDbGetMessageById.mockResolvedValue(messages[0]);
    mockReportDbCreateReport.mockResolvedValue(new Report({ description }));

    userDb.getUserbyUsername = mockUserDbGetUserByUsername;
    messageDb.getMessageById = mockMessageDbGetMessageById;
    reportDb.createReport = mockReportDbCreateReport;

    const result = await reportService.createReport(username, messageId, description);

    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith(username);
    expect(mockMessageDbGetMessageById).toHaveBeenCalledWith(messageId);
    expect(mockReportDbCreateReport).toHaveBeenCalledWith(description, messageId, 1);
    expect(result).toBeInstanceOf(Report);
});

test('given missing description, when createReport, then error is thrown', async () => {
    const username = 'johnDoe';
    const messageId = 1;
    const description = '';

    await expect(reportService.createReport(username, messageId, description)).rejects.toThrow(
        'Description is required.'
    );
});

test('given missing username, when createReport, then error is thrown', async () => {
    const username = '';
    const messageId = 1;
    const description = 'Test report description';

    await expect(reportService.createReport(username, messageId, description)).rejects.toThrow(
        'User ID is required.'
    );
});

test('given non-existent user, when createReport, then error is thrown', async () => {
    const username = 'nonExistentUser';
    const messageId = 1;
    const description = 'Test report description';

    mockUserDbGetUserByUsername.mockResolvedValue(null);
    userDb.getUserbyUsername = mockUserDbGetUserByUsername;

    await expect(reportService.createReport(username, messageId, description)).rejects.toThrow(
        'User not found.'
    );
});

test('given non-existent message, when createReport, then error is thrown', async () => {
    const username = 'johnDoe';
    const messageId = 999;
    const description = 'Test report description';

    mockUserDbGetUserByUsername.mockResolvedValue(users[0]);
    mockMessageDbGetMessageById.mockResolvedValue(null);

    userDb.getUserbyUsername = mockUserDbGetUserByUsername;
    messageDb.getMessageById = mockMessageDbGetMessageById;

    await expect(reportService.createReport(username, messageId, description)).rejects.toThrow(
        'Message not found.'
    );
});

test('given user with undefined id, when createReport, then error is thrown', async () => {
    const username = 'johnDoe';
    const messageId = 1;
    const description = 'Test report description';

    mockMessageDbGetMessageById.mockReturnValue(messages[0]);
    mockUserDbGetUserByUsername.mockResolvedValue({ ...users[0], getId: () => undefined });
    messageDb.getMessageById = mockMessageDbGetMessageById;
    userDb.getUserbyUsername = mockUserDbGetUserByUsername;

    await expect(reportService.createReport(username, messageId, description)).rejects.toThrow(
        'Username is required.'
    );
});
