import { Group } from "../model/group";
import { User } from "../model/user";
import groupDb from "../repository/group.db";
import { GroupInput, UserInput, GroupDTO, UserDTO } from "../types"; // Import your DTOs

const getAllGroups = (): GroupDTO[] => {
    const groups = groupDb.getAllGroups();
    // Map the Group to GroupDTO
    return groups.map(group => ({
        id: group.getId()!,
        name: group.getName(),
        description: group.getDescription(),
        code: group.getCode(),
        users: group.getUsers().map(user => ({
            id: user.getId()!,
            username: user.getUsername(),
        })),
    }));
}

const addUserToGroup = ({code}: GroupInput, {id}: UserInput): GroupDTO => {
    if (!code) {
        throw new Error('Group code is required');
    }
    if (!id) {
        throw new Error('User id is required');
    }
    const group = groupDb.addUserToGroup(code, id);
    return {
        id: group.getId()!,
        name: group.getName(),
        description: group.getDescription(),
        code: group.getCode(),
        users: group.getUsers().map(user => ({
            id: user.getId()!,
            username: user.getUsername(),
        })),
    };
}

const getUsersByGroup = (code: string): UserDTO[] => {
    if (!code) {
        throw new Error('Group code is required');
    }
    const users = groupDb.getUsersByGroup(code);
    // Map the User to UserDTO
    return users.map(user => ({
        id: user.getId()!,
        username: user.getUsername(),
        email: user.getEmail(),
        role: user.getRole(),
        groups: user.getGroups().map(group => ({
            id: group.getId()!,
            name: group.getName(),
        })),
    }));
}

export default {
    getAllGroups,
    addUserToGroup,
    getUsersByGroup,
}
