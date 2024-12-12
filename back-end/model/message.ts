import { Message as MessagePrisma } from '@prisma/client';
import { Group as GroupPrisma } from '@prisma/client';
import { User as UserPrisma } from '@prisma/client';
import { Group } from './group';
import { User } from './user';
export class Message {
    private id?: number;
    private content: string;
    private date: string;
    private group?: Group;
    private user?: { id: number; username: string };

    constructor(message: {
        id?: number;
        content: string;
        group?: Group;
        user?: { id: number; username: string };
        date?: string;
    }) {
        this.validate(message);
        this.id = message.id;
        this.content = message.content;
        this.date = message.date ? message.date : this.formatDate(new Date());
        this.group = message.group;
        this.user = message.user;
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

    getUser(): { id: number; username: string } | undefined {
        return this.user;
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

    static from({
        id,
        content,
        group,
        user,
        date,
    }: MessagePrisma & { group?: Group; user?: { id: number; username: string }; date?: string }) {
        return new Message({
            id,
            content,
            group,
            user,
            date,
        });
    }
}
