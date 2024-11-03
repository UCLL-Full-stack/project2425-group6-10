import { after } from "node:test";
import { User } from "../../model/user";
import userDb from "../../repository/user.db";
import userService from "../../service/user.service";

const users = [
    new User({ username: 'johnDoe', email: 'john.doe@gmail.com', password: 'John1234', role: 'student', groups: [] }),
    new User({ username: 'janeDoe', email: 'jane.doe@gmail.com', password: 'Jane1234', role: 'lecturer', groups: [] }),
]

let mockUserDbGetAllUsers: jest.Mock;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();    
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given: list of users, when getAllUsers, then: list of users is returned', () => {
    userDb.getAllUsers = mockUserDbGetAllUsers.mockReturnValue(users);

    userService.getAllUsers();

    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
    expect(mockUserDbGetAllUsers).toHaveReturnedWith(users);
});