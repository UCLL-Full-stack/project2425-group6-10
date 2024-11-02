import { Group } from "../model/group";
import groupDb from "../repository/group.db";

const getAllGroups = (): Group[] => groupDb.getAllGroups();

export default {
    getAllGroups,
}