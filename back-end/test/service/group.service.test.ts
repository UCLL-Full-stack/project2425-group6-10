import { be } from "date-fns/locale";
import { Group } from "../../model/group";
import groupDb from "../../repository/group.db";
import groupService from "../../service/group.service";

const groups = [
    new Group({ id: 1, name: 'Toegepaste Informatica', description: 'Group for TI students', users: [] }),
    new Group({ id: 2, name: 'Marketing', description: 'Group for marketing students', users: [] }),
    new Group({ id: 3, name: 'General', description: 'Group for general questions', users: [] })
]

let mockGroupDbGetAllGroups: jest.Mock;

beforeEach(() => {
    mockGroupDbGetAllGroups = jest.fn();    
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