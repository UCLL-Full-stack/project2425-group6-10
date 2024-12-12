import { be } from 'date-fns/locale';
import { Group } from '../../model/group';
import groupDb from '../../repository/group.db';
import groupService from '../../service/group.service';
import { User } from '../../model/user';

const groups = [
    new Group({
        id: 1,
        name: 'Toegepaste Informatica',
        description: 'Group for TI students',
    }),
    new Group({ id: 2, name: 'Marketing', description: 'Group for marketing students' }),
    new Group({ id: 3, name: 'General', description: 'Group for general questions' }),
];

const user = new User({
    id: 1,
    username: 'johnDoe',
    email: 'john.doe@gmail.com',
    password: 'John1234',
    role: 'student',
    groups: [],
    messages: [],
});

let mockGroupDbGetAllGroups: jest.Mock;
let mockGroupDbGetGroupsByUsername: jest.Mock;
let mockUserDbAddUserToGroup: jest.Mock;

beforeEach(() => {
    mockGroupDbGetAllGroups = jest.fn();
    mockGroupDbGetGroupsByUsername = jest.fn();
    mockUserDbAddUserToGroup = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of groups, when getAllGroups as admin, then: list of groups is returned', () => {
    groupDb.getAllGroups = mockGroupDbGetAllGroups.mockReturnValue(groups);
    const username = 'admin';
    const role = 'admin';
    groupService.getGroups(username, role);

    expect(mockGroupDbGetAllGroups).toHaveBeenCalledTimes(1);
    expect(mockGroupDbGetAllGroups).toHaveReturnedWith(groups);
});

test('given: list of groups, when getAllGroups as student, then: list of groups of that student is returned', () => {
    groupDb.getGroupsByUsername = mockGroupDbGetGroupsByUsername.mockReturnValue(groups);
    const username = 'johnDoe';
    const role = 'student';
    groupService.getGroups(username, role);

    expect(mockGroupDbGetGroupsByUsername).toHaveBeenCalledTimes(1);
    expect(mockGroupDbGetGroupsByUsername).toHaveReturnedWith(groups);
});

test('given: list of groups, when getAllGroups as lecturer, then: list of groups of that lecturer is returned', () => {
    groupDb.getGroupsByUsername = mockGroupDbGetGroupsByUsername.mockReturnValue(groups);
    const username = 'johnDoe';
    const role = 'lecturer';
    groupService.getGroups(username, role);

    expect(mockGroupDbGetGroupsByUsername).toHaveBeenCalledTimes(1);
    expect(mockGroupDbGetGroupsByUsername).toHaveReturnedWith(groups);
});
