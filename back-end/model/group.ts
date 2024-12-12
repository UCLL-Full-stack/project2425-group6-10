import { v4 as uuidv4 } from 'uuid';
import { Group as groupsPrisma } from '@prisma/client';
import { User } from './user';
import { Message } from './message';

export class Group {
    readonly id?: number;
    readonly name: string;
    readonly description: string;
    readonly code: string;
    readonly messages: Message[];

    constructor(group: {
        id: number;
        name: string;
        description: string;
        code?: string;
        messages?: Message[];
    }) {
        this.validate(group);
        this.id = group.id;
        this.name = group.name;
        this.description = group.description;
        this.code = group.code || this.generateCode();
        this.messages = group.messages || [];
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getCode(): string {
        return this.code;
    }
    getMessages(): Message[] {
        return this.messages;
    }

    validate(group: { id: number; name: string; description: string }) {
        if (!group.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!group.description?.trim()) {
            throw new Error('Description is required');
        }
    }

    generateCode(): string {
        return uuidv4().substring(0, 6);
    }

    equals(group: Group): boolean {
        return this.name === group.getName() && this.description === group.getDescription();
    }

    static from({ id, name, description, code }: groupsPrisma) {
        return new Group({
            id,
            name,
            description,
            code,
            messages: [],
        });
    }
}
