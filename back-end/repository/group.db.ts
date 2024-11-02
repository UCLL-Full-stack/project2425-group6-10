import exp from "constants";
import { Group } from "../model/group";

const groups = [
    new Group({ id: 1, name: 'Toegepaste Informatica', description: 'Group for TI students' }),
    new Group({ id: 2, name: 'Marketing', description: 'Group for marketing students' }),
    new Group({ id: 3, name: 'General', description: 'Group for general questions' }),
]

const getAllGroups = (): Group[] => {
    return groups;
}

export default {
    getAllGroups,
}