import exp from "constants";
import { Group } from "../model/group";
import userDb from "./user.db";
import { User } from "../model/user";

const groups = [
    new Group({ id: 1, name: 'Toegepaste Informatica', description: 'Group for TI students', users: [] }),
    new Group({ id: 2, name: 'Marketing', description: 'Group for marketing students', users: [] }),
    new Group({ id: 3, name: 'General', description: 'Group for general questions', users: [] }),
]

const getAllGroups = (): Group[] => {
    return groups;
}

const addUserToGroup = (code: string, userId: number): Group => {
    const group = groups.find(group => group.getCode() === code);
    if (!group) {
        throw new Error('Group not found');
    }
    const user = userDb.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    group.addUserToGroup(user);
    user.addGroupToUser(group);
    return group;
}

const getUsersByGroup = (code: string): User[] => {
    const group = groups.find(group => group.getCode() === code);
    if (!group) {
        throw new Error('Group not found');
    }
    return group.getUsers();
}

export default {
    getAllGroups,
    addUserToGroup,
    getUsersByGroup,
}