import { User } from "../model/user";

const users = [
    new User({ username: 'johnDoe', email: 'john.doe@gmail.com', password: 'John1234', role: 'student' }),
    new User({ username: 'janeDoe', email: 'jane.doe@gmail.com', password: 'Jane1234', role: 'lecturer' }),
    new User({ username: 'jimDoe', email: 'jim.doe@gmail.com', password: 'Jim12345', role: 'admin' }),
]

const getAllUsers = (): User[] => {
    return users;
}

export default {
    getAllUsers,
}