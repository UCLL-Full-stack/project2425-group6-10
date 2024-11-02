import { User } from "../model/user";
import userDb from "../repository/user.db";

const getAllUsers = (): User[] => userDb.getAllUsers();

export default {
    getAllUsers,
};