import { get } from "http";
import { Message } from "../model/message";

const messages = [
    new Message({ content: 'Hi how are you?' }),
    new Message({ content: 'I am good, thank you!' }),
    new Message({ content: 'Welcome in our group!' }),
]

const getAllMessages = (): Message[] => {
    return messages;
}

export default {
    getAllMessages,
}