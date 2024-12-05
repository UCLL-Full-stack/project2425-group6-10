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
        users: [],
    }),
    new Group({ id: 2, name: 'Marketing', description: 'Group for marketing students', users: [] }),
    new Group({ id: 3, name: 'General', description: 'Group for general questions', users: [] }),
];

const user = new User({
    id: 1,
    username: 'johnDoe',
    email: 'john.doe@gmail.com',
    password: 'John1234',
    role: 'student',
    groups: [],
});

let mockGroupDbGetAllGroups: jest.Mock;
let mockUserDbAddUserToGroup: jest.Mock;

beforeEach(() => {
    mockGroupDbGetAllGroups = jest.fn();
    mockUserDbAddUserToGroup = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of groups, when getAllGroups, then: list of groups is returned', () => {
    groupDb.getAllGroups = mockGroupDbGetAllGroups.mockReturnValue(groups);

    groupService.getAllGroups();

    expect(mockGroupDbGetAllGroups).toHaveBeenCalledTimes(1);
    expect(mockGroupDbGetAllGroups).toHaveReturnedWith(groups);
});

test('given: user, when add user to group, then: user is added to group', () => {
    const mockedGroup = new Group({
        id: 1,
        name: 'Toegepaste Informatica',
        description: 'Group for TI students',
        users: [user],
    });
    mockUserDbAddUserToGroup.mockReturnValue(mockedGroup);
    groupDb.addUserToGroup = mockUserDbAddUserToGroup;

    const result = groupService.addUserToGroup({ code: 'TI1010' }, { id: 1 });

    expect(mockUserDbAddUserToGroup).toHaveBeenCalledTimes(1);
    expect(mockUserDbAddUserToGroup).toHaveBeenCalledWith('TI1010', 1);
    expect(result).toEqual({
        id: mockedGroup.getId(),
        name: mockedGroup.getName(),
        description: mockedGroup.getDescription(),
        code: mockedGroup.getCode(),
        users: [
            {
                id: user.getId(),
                username: user.getUsername(),
            },
        ],
    });
});
