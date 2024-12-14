import { be } from 'date-fns/locale';
import { Group } from '../../model/group';
import groupDb from '../../repository/group.db';
import groupService from '../../service/group.service';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import { UnauthorizedError } from 'express-jwt';

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
const lecturer = new User({
    id: 1,
    username: 'johnDoe',
    email: 'john.doe@gmail.com',
    password: 'John1234',
    role: 'lecturer',
    groups: [],
    messages: [],
});
let mockGroupDbGetAllGroups: jest.Mock;
let mockGroupDbGetGroupsByUsername: jest.Mock;
let mockGroupDbGetGroupById: jest.Mock;
let mockUserDbAddUserToGroup: jest.Mock;
let mockUserDbGetUserByUsername: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockGroupDbCreateGroup: jest.Mock;
let mockGroupDbGetGroupByCode: jest.Mock;
let mockGroupDbUpdateGroup: jest.Mock;

beforeEach(() => {
    mockGroupDbGetAllGroups = jest.fn();
    mockGroupDbGetGroupsByUsername = jest.fn();
    mockUserDbAddUserToGroup = jest.fn();
    mockGroupDbGetGroupById = jest.fn();
    mockUserDbGetUserByUsername = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockGroupDbCreateGroup = jest.fn();
    mockGroupDbGetGroupByCode = jest.fn();
    mockGroupDbUpdateGroup = jest.fn();
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

test('given: groupId, when: get group by id, then group returned', async () => {
    const groupId = 1;
    groupDb.getGroupById = mockGroupDbGetGroupById.mockReturnValue(groups[0]);
    const result = await groupService.getGroupById(groupId);

    expect(result).toEqual(groups[0]);
});

test('given: group data, when: create group as admin, then: group is created', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'admin';
    const role = 'admin';
    groupDb.createGroup = mockGroupDbCreateGroup.mockReturnValue(groups[0]);
    const result = await groupService.createGroup(username, role, groupInput);

    expect(result).toEqual(groups[0]);
});

test('given: group data, when: create group as lecturer, then: group is created', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'johnDoe';
    const role = 'lecturer';
    groupDb.getGroupByCode = mockGroupDbGetGroupByCode.mockReturnValue(null);
    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(lecturer);
    groupDb.getGroupsByUsername = mockGroupDbGetGroupsByUsername.mockReturnValue(groups);
    groupDb.createGroup = mockGroupDbCreateGroup.mockReturnValue(groups[0]);
    const result = await groupService.createGroup(username, role, groupInput);

    expect(result).toEqual(groups[0]);
});

test('given: group data, when: create group as admin, then: group is created', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'admin';
    const role = 'admin';
    groupDb.createGroup = mockGroupDbCreateGroup.mockReturnValue(groups[0]);

    const result = await groupService.createGroup(username, role, groupInput);

    expect(result).toEqual(groups[0]);
    expect(mockGroupDbCreateGroup).toHaveBeenCalledTimes(1);
});
test('given: group data, when: create group as lecturer, then: group is created', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'johnDoe';
    const role = 'lecturer';
    groupDb.getGroupByCode = mockGroupDbGetGroupByCode.mockReturnValue(null);
    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(lecturer);
    groupDb.createGroup = mockGroupDbCreateGroup.mockReturnValue(groups[0]);

    const result = await groupService.createGroup(username, role, groupInput);

    expect(result).toEqual(groups[0]);
    expect(mockGroupDbCreateGroup).toHaveBeenCalledTimes(1);
});
test('given: group data, when: create group with unauthorized role, then: throw UnauthorizedError', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'johnDoe';
    const role = 'student';
    await expect(groupService.createGroup(username, role, groupInput)).rejects.toThrowError(
        new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        })
    );
});
test('given: missing group name, when: create group, then: throw error "Group name is required"', async () => {
    const groupInput = { name: '', description: 'Test group' };
    const username = 'admin';
    const role = 'admin';

    await expect(groupService.createGroup(username, role, groupInput)).rejects.toThrowError(
        new Error('Group name is required')
    );
});
test('given: missing group description, when: create group, then: throw error "Group description is required"', async () => {
    const groupInput = { name: 'Test', description: '' };
    const username = 'admin';
    const role = 'admin';

    await expect(groupService.createGroup(username, role, groupInput)).rejects.toThrowError(
        new Error('Group description is required')
    );
});
test('given: group with existing code, when: create group, then: generate new unique code', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'admin';
    const role = 'admin';

    groupDb.getGroupByCode = mockGroupDbGetGroupByCode
        .mockReturnValueOnce(groups[0])
        .mockReturnValueOnce(null);
    groupDb.createGroup = mockGroupDbCreateGroup.mockReturnValue(groups[0]);

    const result = await groupService.createGroup(username, role, groupInput);

    expect(result).toEqual(groups[0]);
    expect(groupDb.getGroupByCode).toHaveBeenCalledTimes(2);
});

test('given: group data, when: create group as lecturer with invalid lecturer, then: throw error "User not found"', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'johnDoe';
    const role = 'lecturer';
    groupDb.getGroupByCode = mockGroupDbGetGroupByCode.mockReturnValue(null);
    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(null);

    await expect(groupService.createGroup(username, role, groupInput)).rejects.toThrowError(
        new Error('User not found')
    );
});
test('given: group data, when: create group as lecturer with valid lecturer, then: group is created', async () => {
    const groupInput = { name: 'Test', description: 'Test group' };
    const username = 'johnDoe';
    const role = 'lecturer';
    groupDb.getGroupByCode = mockGroupDbGetGroupByCode.mockReturnValue(null);
    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(lecturer);
    groupDb.createGroup = mockGroupDbCreateGroup.mockReturnValue(groups[0]);

    const result = await groupService.createGroup(username, role, groupInput);

    expect(result).toEqual(groups[0]);
    expect(mockGroupDbCreateGroup).toHaveBeenCalledTimes(1);
});
test('given: valid data, when: update group as admin, then: group is updated', async () => {
    const groupId = 1;
    const groupInput = { name: 'Updated Name', description: 'Updated description' };
    const username = 'admin';
    const role = 'admin';
    const regenerateCode = false;

    const existingGroup = new Group({
        id: 1,
        name: 'Old Name',
        description: 'Old description',
        code: 'OLD123',
    });

    groupDb.getGroupById = mockGroupDbGetGroupById.mockReturnValue(existingGroup);
    groupDb.updateGroup = mockGroupDbUpdateGroup.mockReturnValue(existingGroup);

    const result = await groupService.updateGroup(role, groupId, regenerateCode, groupInput);

    expect(result).toEqual(existingGroup);
    expect(mockGroupDbGetGroupById).toHaveBeenCalledWith(groupId);
    expect(mockGroupDbUpdateGroup).toHaveBeenCalledWith(groupId, expect.any(Group), 'OLD123');
});
test('given: valid data, when: update group as lecturer, then: group is updated', async () => {
    const groupId = 1;
    const groupInput = { name: 'Updated Name', description: 'Updated description' };
    const username = 'johnDoe';
    const role = 'lecturer';
    const regenerateCode = false;

    const existingGroup = new Group({
        id: 1,
        name: 'Old Name',
        description: 'Old description',
        code: 'OLD123',
    });

    groupDb.getGroupById = mockGroupDbGetGroupById.mockReturnValue(existingGroup);
    groupDb.updateGroup = mockGroupDbUpdateGroup.mockReturnValue(existingGroup);

    const result = await groupService.updateGroup(role, groupId, regenerateCode, groupInput);

    expect(result).toEqual(existingGroup);
    expect(mockGroupDbGetGroupById).toHaveBeenCalledWith(groupId);
    expect(mockGroupDbUpdateGroup).toHaveBeenCalledWith(groupId, expect.any(Group), 'OLD123');
});
test('given: invalid role, when: update group, then: throw UnauthorizedError', async () => {
    const groupId = 1;
    const groupInput = { name: 'Updated Name', description: 'Updated description' };
    const username = 'johnDoe';
    const role = 'student'; // Unauthorized role
    const regenerateCode = false;

    await expect(
        groupService.updateGroup(role, groupId, regenerateCode, groupInput)
    ).rejects.toThrowError(
        new UnauthorizedError('credentials_required', {
            message: 'You are not authorized to access this resource.',
        })
    );
});
test('given: missing group name, when: update group, then: throw error "Group name is required"', async () => {
    const groupId = 1;
    const groupInput = { name: '', description: 'Updated description' }; // Empty name
    const username = 'admin';
    const role = 'admin';
    const regenerateCode = false;

    await expect(
        groupService.updateGroup(role, groupId, regenerateCode, groupInput)
    ).rejects.toThrowError(new Error('Group name is required'));
});
test('given: missing group description, when: update group, then: throw error "Group description is required"', async () => {
    const groupId = 1;
    const groupInput = { name: 'Updated Name', description: '' }; // Empty description
    const username = 'admin';
    const role = 'admin';
    const regenerateCode = false;

    await expect(
        groupService.updateGroup(role, groupId, regenerateCode, groupInput)
    ).rejects.toThrowError(new Error('Group description is required'));
});
test('given: non-existing group, when: update group, then: throw error "Group not found"', async () => {
    const groupId = 999; // Non-existing group
    const groupInput = { name: 'Updated Name', description: 'Updated description' };
    const username = 'admin';
    const role = 'admin';
    const regenerateCode = false;

    groupDb.getGroupById = mockGroupDbGetGroupById.mockReturnValue(null); // Simulate group not found

    await expect(
        groupService.updateGroup(role, groupId, regenerateCode, groupInput)
    ).rejects.toThrowError(new Error('Group not found'));
});
test('given: regenerateCode true, when: update group, then: generate new unique code', async () => {
    const groupId = 1;
    const groupInput = { name: 'Updated Name', description: 'Updated description' };
    const username = 'admin';
    const role = 'admin';
    const regenerateCode = true;

    const existingGroup = new Group({
        id: 1,
        name: 'Old Name',
        description: 'Old description',
        code: 'OLD123',
    });

    groupDb.getGroupById = mockGroupDbGetGroupById.mockReturnValue(existingGroup);
    groupDb.getGroupByCode = mockGroupDbGetGroupByCode
        .mockReturnValueOnce(existingGroup)
        .mockReturnValueOnce(null); // Simulate code collision
    groupDb.updateGroup = mockGroupDbUpdateGroup.mockReturnValue(existingGroup);

    const result = await groupService.updateGroup(role, groupId, regenerateCode, groupInput);

    expect(result).toEqual(existingGroup);
    expect(groupDb.getGroupByCode).toHaveBeenCalledTimes(2); // First check and then regenerate
});
