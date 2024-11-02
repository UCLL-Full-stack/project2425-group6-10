import { Message } from "../model/message";
import messageDb from "../repository/message.db";

const getAllMessages = (): Message[] => messageDb.getAllMessages();

export default {
    getAllMessages,
};