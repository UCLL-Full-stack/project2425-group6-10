import { User } from "../model/user";

const users = [
    new User({ id: 1, username: 'johnDoe', email: 'john.doe@gmail.com', password: 'John1234', role: 'student', groups: [] }),
    new User({ id: 2, username: 'janeDoe', email: 'jane.doe@gmail.com', password: 'Jane1234', role: 'lecturer', groups: [] }),
    new User({ id: 3, username: 'jimDoe', email: 'jim.doe@gmail.com', password: 'Jim12345', role: 'admin', groups: [] }),
]

const getAllUsers = (): User[] => {
    return users;
}

const getUserById = (id: number): User | undefined => {
    return users.find(user => user.getId() === id);
}

export default {
    getAllUsers,
    getUserById,
}