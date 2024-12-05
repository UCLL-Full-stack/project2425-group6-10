import { Group } from '../model/group';
import { User } from '../model/user';
import groupDb from '../repository/group.db';
import userDb from '../repository/user.db';
const getAllGroups = async (): Promise<Group[]> => {
    const groups = await groupDb.getAllGroups();
    return groups;
};

export default { getAllGroups };
