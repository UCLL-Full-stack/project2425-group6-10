import { after } from 'node:test';
import bcrypt from 'bcrypt';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import { Group } from '../../model/group';
import groupDb from '../../repository/group.db';
import { generateJwtToken } from '../../util/jwt';
jest.mock('../../util/jwt');
const users = [
    new User({
        id: 1,
        username: 'johnDoe',
        email: 'john.doe@gmail.com',
        password: 'John1234',
        role: 'student',
    }),
    new User({
        id: 2,
        username: 'janeDoe',
        email: 'jane.doe@gmail.com',
        password: 'Jane1234',
        role: 'lecturer',
    }),
];

const groups = [
    new Group({
        id: 1,
        name: 'group1',
        description: 'group1 description',
        code: 'AE1234',
    }),
];

let mockUserDbGetAllUsers: jest.Mock;
let mockUserDbGetUserById: jest.Mock;
let mockUserDbAddGroupToUser: jest.Mock;
let mockUserDbGetGroupById: jest.Mock;
let mockUserDbGetUsersByGroupId: jest.Mock;
let mockUserDbCreateUser: jest.Mock;
let mockUserDbGetUserByUsername: jest.Mock;
let mockGenerateJwtToken: jest.Mock;
let mockUserDbGetGroupByCode: jest.Mock;
let mockUserDbGetUserbyUsername: jest.Mock;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();
    mockUserDbGetUserById = jest.fn();
    mockUserDbAddGroupToUser = jest.fn();
    mockUserDbGetGroupById = jest.fn();
    mockUserDbGetUsersByGroupId = jest.fn();
    mockUserDbCreateUser = jest.fn();
    mockUserDbGetUserByUsername = jest.fn();
    mockGenerateJwtToken = jest.fn();
    mockUserDbGetGroupByCode = jest.fn();
    mockUserDbGetUserbyUsername = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of users, when getAllUsers, then: list of users is returned', () => {
    userDb.getAllUsers = mockUserDbGetAllUsers.mockReturnValue(users);

    userService.getAllUsers('admin');

    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetAllUsers).toHaveReturnedWith(users);
});

test('given: user id, when getUserById, then: user is returned', () => {
    const userId = 1;
    userDb.getUserById = mockUserDbGetUserById.mockReturnValue(users[0]);

    userService.getUserById(userId);

    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserById).toHaveBeenCalledWith(userId);
    expect(mockUserDbGetUserById).toHaveReturnedWith(users[0]);
});

test('given: user id, when getUserById, then: user not found error is thrown', async () => {
    const userId = 3;
    mockUserDbGetUserById.mockResolvedValue(null);
    userDb.getUserById = mockUserDbGetUserById;

    await expect(userService.getUserById(userId)).rejects.toThrow(`User with id 3 not found`);
    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserById).toHaveBeenCalledWith(userId);
});

test('given: user id and group id, when addGroupToUser, then: user with group is returned', async () => {
    const username = 'JohnDoe';
    const groupCode = 'AE1234';

    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(users[0]);
    groupDb.getGroupByCode = mockUserDbGetGroupByCode.mockReturnValue(groups[0]);

    const updatedUser = {
        ...users[0],
        groups: [groups[0]],
    };
    userDb.addGroupToUser = mockUserDbAddGroupToUser.mockReturnValue(updatedUser);

    const result = await userService.addGroupToUser(username, groupCode);

    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith(username);
    expect(mockUserDbGetGroupByCode).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetGroupByCode).toHaveBeenCalledWith(groupCode);
    expect(mockUserDbAddGroupToUser).toHaveBeenCalledTimes(1);
    expect(mockUserDbAddGroupToUser).toHaveBeenCalledWith(username, groupCode);
    expect(result).toEqual(updatedUser);
});

test('given: user id and group id, when addGroupToUser, then: user not found error is thrown', async () => {
    const username = 'JohnDoe';
    const groupCode = 'AE1234';

    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(null);
    groupDb.getGroupByCode = mockUserDbGetGroupByCode.mockReturnValue(groups[0]);

    await expect(userService.addGroupToUser(username, groupCode)).rejects.toThrow(
        `User JohnDoe not found`
    );
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith(username);
});

test('given: user id and group id, when addGroupToUser, then: group not found error is thrown', async () => {
    const username = 'JohnDoe';
    const groupCode = 'AE1234';

    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockReturnValue(users[0]);
    groupDb.getGroupByCode = mockUserDbGetGroupByCode.mockReturnValue(null);

    await expect(userService.addGroupToUser(username, groupCode)).rejects.toThrow(
        `Group with code AE1234 not found`
    );
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith(username);
    expect(mockUserDbGetGroupByCode).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetGroupByCode).toHaveBeenCalledWith(groupCode);
});

test('given: group id, when getUsersByGroupId, then: list of users is returned', async () => {
    const groupId = 1;
    groupDb.getGroupById = mockUserDbGetGroupById.mockReturnValue(groups[0]);
    userDb.getUsersByGroupId = mockUserDbGetUsersByGroupId.mockReturnValue(users);

    const result = await userService.getUsersByGroupId(groupId);

    expect(mockUserDbGetGroupById).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetGroupById).toHaveBeenCalledWith(groupId);
    expect(mockUserDbGetUsersByGroupId).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUsersByGroupId).toHaveBeenCalledWith(groupId);
    expect(result).toEqual(users);
});

test('given: group id, when getUsersByGroupId, then: group not found error is thrown', async () => {
    const groupId = 3;
    groupDb.getGroupById = mockUserDbGetGroupById.mockReturnValue(null);

    await expect(userService.getUsersByGroupId(groupId)).rejects.toThrow(
        `Group with id 3 not found`
    );
    expect(mockUserDbGetGroupById).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetGroupById).toHaveBeenCalledWith(groupId);
});

test('given: username email password, when: creating user, then: user is created with those values', async () => {
    const userInput = {
        username: 'johnDoe',
        email: 'john.doe@gmail.com',
        password: 'John1234',
    };

    const hashedPassword = 'hashedPassword123';
    const createdUser = new User({
        username: userInput.username,
        email: userInput.email,
        password: hashedPassword,
        role: 'student',
    });

    const mockGetUserByUsername = jest.fn().mockResolvedValue(null);
    const mockHashPassword = jest.fn().mockResolvedValue(hashedPassword);
    const mockCreateUser = jest.fn().mockResolvedValue(createdUser);

    userDb.getUserbyUsername = mockGetUserByUsername;
    bcrypt.hash = mockHashPassword;
    userDb.createUser = mockCreateUser;

    const result = await userService.createUser(userInput);

    expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(userInput.username);

    expect(mockHashPassword).toHaveBeenCalledTimes(1);
    expect(mockHashPassword).toHaveBeenCalledWith(userInput.password, 10);

    expect(mockCreateUser).toHaveBeenCalledTimes(1);
    expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({
            username: userInput.username,
            email: userInput.email,
            password: hashedPassword,
            role: 'student',
        })
    );

    expect(result).toEqual(createdUser);
});

test('given: no username, when: creating user, then: error is thrown', async () => {
    const username = undefined;
    const email = 'john.doe@gmail.com';
    const password = 'JohnDoe123';

    await expect(userService.createUser({ username, email, password })).rejects.toThrow(
        'Username is required'
    );
});

test('given: no email, when: creating user, then: error is thrown', async () => {
    const username = 'JohnDoe';
    const email = undefined;
    const password = 'JohnDoe123';

    await expect(userService.createUser({ username, email, password })).rejects.toThrow(
        'Email is required'
    );
});

test('given: no email, when: creating user, then: error is thrown', async () => {
    const username = 'JohnDoe';
    const email = 'john.doe@gmail.com';
    const password = undefined;

    await expect(userService.createUser({ username, email, password })).rejects.toThrow(
        'Password is required'
    );
});

test('given: existing user, when: creating user, then: error is thrown', async () => {
    const username = 'johnDoe';
    const email = 'john.doe@gmail.com';
    const password = 'JohnDoe123';

    userDb.getUserbyUsername = mockUserDbGetUserByUsername.mockResolvedValue(users[0]);

    await expect(userService.createUser({ username, email, password })).rejects.toThrow(
        'User already exists'
    );
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith(username);

    expect(mockUserDbCreateUser).toHaveBeenCalledTimes(0);
});

test('given: valid username and password, when: authenticating, then: authentication response is returned', async () => {
    const username = 'johnDoe';
    const password = 'John1234';
    const hashedPassword = await bcrypt.hash(password, 12);
    const token = 'mockJwtToken';

    const user = new User({
        id: 1,
        username,
        email: 'john.doe@gmail.com',
        password: hashedPassword,
        role: 'student',
    });

    mockUserDbGetUserByUsername.mockResolvedValue(user);
    userDb.getUserbyUsername = mockUserDbGetUserByUsername;

    const mockComparePassword = jest.fn().mockResolvedValue(true);
    bcrypt.compare = mockComparePassword;

    (generateJwtToken as jest.Mock).mockReturnValue(token);

    const result = await userService.authenticate({ username, password });

    expect(mockUserDbGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetUserByUsername).toHaveBeenCalledWith(username);

    expect(mockComparePassword).toHaveBeenCalledTimes(1);
    expect(mockComparePassword).toHaveBeenCalledWith(password, hashedPassword);

    expect(generateJwtToken).toHaveBeenCalledTimes(1);
    expect(generateJwtToken).toHaveBeenCalledWith({ username, role: user.getRole() });

    expect(result).toEqual({
        token,
        username,
        role: user.getRole(),
    });
});

test('given: missing username, when: authenticating, then: error is thrown', async () => {
    const username = undefined;
    const password = 'John1234';

    await expect(userService.authenticate({ username, password })).rejects.toThrow(
        'Username is required'
    );
});

test('given: missing password, when: authenticating, then: error is thrown', async () => {
    const username = 'johnDoe';
    const password = undefined;

    await expect(userService.authenticate({ username, password })).rejects.toThrow(
        'Password is required'
    );
});

test('given: no existing username, when: authenticating, then: error is thrown', async () => {
    const username = 'nonExistentUser';
    const password = 'SomePassword123';

    const mockGetUserByUsername = jest.fn().mockResolvedValue(null);
    userDb.getUserbyUsername = mockGetUserByUsername;

    await expect(userService.authenticate({ username, password })).rejects.toThrow(
        'username or password is incorrect.'
    );

    expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(username);
});

test('given: incorrect password, when: authenticating, then: error is thrown', async () => {
    const username = 'johnDoe';
    const password = 'WrongPassword';
    const user = new User({
        id: 1,
        username: username,
        email: 'john.doe@gmail.com',
        password: 'hashedPassword',
        role: 'student',
    });

    const mockGetUserByUsername = jest.fn().mockResolvedValue(user);
    const mockComparePassword = jest.fn().mockResolvedValue(false);

    userDb.getUserbyUsername = mockGetUserByUsername;
    bcrypt.compare = mockComparePassword;

    await expect(userService.authenticate({ username, password })).rejects.toThrow(
        'username or password is incorrect.'
    );

    expect(mockGetUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockGetUserByUsername).toHaveBeenCalledWith(username);

    expect(mockComparePassword).toHaveBeenCalledTimes(1);
    expect(mockComparePassword).toHaveBeenCalledWith(password, user.getPassword());
});
