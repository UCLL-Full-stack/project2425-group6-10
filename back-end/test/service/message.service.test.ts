import { Message } from '../../model/message';
import groupDb from '../../repository/group.db';
import messageDb from '../../repository/message.db';
import userDb from '../../repository/user.db';
import messageService from '../../service/message.service';

const messages = [
    new Message({ content: 'Hi how are you?' }),
    new Message({ content: 'I am good, thank you!' }),
];
const mockUser = { getId: jest.fn().mockReturnValue(1) };
const mockGroup = { id: 1 };
const mockMessage = new Message({ content: 'Test message' });

let mockMessageDbGetAllMessages: jest.Mock;
let mockMessageDbGetMessagesByGroup: jest.Mock;
let mockUserDbGetUserbyUsername: jest.Mock;
let mockGroupDbGetGroupById: jest.Mock;
let mockMessageDbSendMessage: jest.Mock;

beforeEach(() => {
    mockMessageDbGetAllMessages = jest.fn();
    mockMessageDbGetMessagesByGroup = jest.fn();
    mockMessageDbSendMessage = jest.fn();
    mockUserDbGetUserbyUsername = jest.fn();
    mockGroupDbGetGroupById = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of messages, when getAllMessages, then: list of messages is returned', () => {
    messageDb.getAllMessages = mockMessageDbGetAllMessages.mockReturnValue(messages);

    messageService.getAllMessages();

    expect(mockMessageDbGetAllMessages).toHaveBeenCalledTimes(1);
    expect(mockMessageDbGetAllMessages).toHaveReturnedWith(messages);
});

test('given: group id, when getMessagesByGroup, then: list of messages is returned', async () => {
    const groupId = 1;
    const username = 'johnDoe';
    const role = 'admin';
    messageDb.getMessagesByGroup = mockMessageDbGetMessagesByGroup.mockReturnValue(messages);

    const result = await messageService.getMessagesByGroup(username, groupId, role);

    expect(mockMessageDbGetMessagesByGroup).toHaveBeenCalledTimes(1);
    expect(mockMessageDbGetMessagesByGroup).toHaveBeenCalledWith(groupId);
    expect(result).toEqual(messages);
});

test('given valid user, group, and content, when sendMessage, then message is sent successfully', async () => {
    const username = 'johnDoe';
    const groupId = 1;
    const content = 'Hello, world!';

    userDb.getUserbyUsername = mockUserDbGetUserbyUsername.mockResolvedValue(mockUser);
    groupDb.getGroupById = mockGroupDbGetGroupById.mockResolvedValue(mockGroup);
    messageDb.sendMessage = mockMessageDbSendMessage.mockResolvedValue(mockMessage);

    const result = await messageService.sendMessage(username, groupId, content);

    expect(mockUserDbGetUserbyUsername).toHaveBeenCalledWith(username);
    expect(mockGroupDbGetGroupById).toHaveBeenCalledWith(groupId);
    expect(mockMessageDbSendMessage).toHaveBeenCalledWith(mockUser.getId(), groupId, content);
    expect(result).toEqual(mockMessage);
});

test('given non-existent user, when sendMessage, then user not found error is thrown', async () => {
    const username = 'nonExistentUser';
    const groupId = 1;
    const content = 'Hello, world!';

    userDb.getUserbyUsername = mockUserDbGetUserbyUsername.mockResolvedValue(null);

    await expect(messageService.sendMessage(username, groupId, content)).rejects.toThrowError(
        'User not found.'
    );
});

test('given non-existent group, when sendMessage, then group not found error is thrown', async () => {
    const username = 'johnDoe';
    const groupId = 999; // non-existent group ID
    const content = 'Hello, world!';

    userDb.getUserbyUsername = mockUserDbGetUserbyUsername.mockResolvedValue(mockUser);
    groupDb.getGroupById = mockGroupDbGetGroupById.mockResolvedValue(null);

    await expect(messageService.sendMessage(username, groupId, content)).rejects.toThrowError(
        'Group not found.'
    );
});

test('given undefined user ID, when sendMessage, then user ID is undefined error is thrown', async () => {
    const username = 'johnDoe';
    const groupId = 1;
    const content = 'Hello, world!';

    const invalidUser = { getId: jest.fn().mockReturnValue(undefined) };
    userDb.getUserbyUsername = mockUserDbGetUserbyUsername.mockResolvedValue(invalidUser);
    groupDb.getGroupById = mockGroupDbGetGroupById.mockResolvedValue(mockGroup);

    await expect(messageService.sendMessage(username, groupId, content)).rejects.toThrowError(
        'User ID is undefined.'
    );
});
