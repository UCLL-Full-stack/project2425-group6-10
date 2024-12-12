import { Message as MessagePrisma } from '@prisma/client';
import { Group as GroupPrisma } from '@prisma/client';
import { Group } from './group';
export class Message {
    private id?: number;
    private content: string;
    private date: string;
    private group?: Group;

    constructor(message: { id?: number; content: string; group?: Group }) {
        this.validate(message);
        this.id = message.id;
        this.content = message.content;
        this.date = this.formatDate(new Date());
        this.group = message.group;
    }

    getId(): number | undefined {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }

    getDate(): string {
        return this.date;
    }
    getGroup(): Group | undefined {
        return this.group;
    }

    validate(message: { id?: number; content: string }) {
        if (!message.content?.trim()) {
            throw new Error('Content is required');
        }
    }

    private formatDate(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    static from({ id, content, group }: MessagePrisma & { group?: Group }) {
        return new Message({
            id,
            content,
            group,
        });
    }
}
