import { Report } from '../../model/report';

test('given valid values, when creating a new report, then report is created', () => {
    const report = new Report({ description: 'Insulting message', date: '2021-10-10 10:10:10' });
    const now = new Date();
    const expectedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
        now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
    ).padStart(2, '0')}`;

    expect(report.getDescription()).toBe('Insulting message');
    expect(report.getDate()).toBe('2021-10-10 10:10:10');
});

test('given empty description, when creating a new report, then an error is thrown', () => {
    const report = () => {
        new Report({ description: '', date: '2021-10-10 10:10:10' });
    };

    expect(report).toThrow('Description is required');
});

test('given only spaces in description, when creating a new report, then an error is thrown', () => {
    const report = () => {
        new Report({ description: '       ', date: '2021-10-10 10:10:10' });
    };

    expect(report).toThrow('Description is required');
});
