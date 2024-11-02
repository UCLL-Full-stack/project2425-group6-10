import { Message } from '../../model/message';

test('given valid values, when creating a new message, then message is created', () => {
    const message = new Message({
        content: 'Hi how are you?',
    });
    const now = new Date();
    const expectedDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    expect(message.getContent()).toBe('Hi how are you?');
    expect(message.getDate()).toBe(expectedDate)
});

test('given empty content, when creating a new message, then an error is thrown', () => {
    const message = () => {
        new Message({
            content: '',
        });
    };

    expect(message).toThrow('Content is required');
});

test('given only spaces in content, when creating a new message, then an error is thrown', () => {
    const message = () => {
        new Message({
            content: '       ',
        });
    };

    expect(message).toThrow('Content is required');
});
