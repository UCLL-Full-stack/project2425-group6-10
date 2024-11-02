import { Message } from "../../model/message";
import messageDb from "../../repository/message.db";
import messageService from "../../service/message.service";

const messages = [
    new Message({ content: 'Hi how are you?' }),
    new Message({ content: 'I am good, thank you!' }),
]

let mockMessageDbGetAllMessages: jest.Mock;

beforeEach(() => {
    mockMessageDbGetAllMessages = jest.fn();    
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