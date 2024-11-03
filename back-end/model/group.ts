import { v4 as uuidv4 } from 'uuid';
import { User } from './user';

export class Group {
    private id?: number;
    private name: string;
    private description: string;
    private code: string;
    private users: User[];

    constructor(group: { 
        id: number; 
        name: string; 
        description: string; 
        users: User[];
    }) {
        this.validate(group);
        this.id = group.id;
        this.name = group.name;
        this.description = group.description;
        this.code = this.generateCode();
        this.users = group.users || [];
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

    getUsers(): User[] {
        return this.users;
    }

    addUserToGroup(user: User): void {
        if (this.users.includes(user)) {
            throw new Error('User is already in the group');
        }
        if (!user){
            throw new Error('User is required');
        }
        this.users.push(user);
    }

    validate(group: { id: number; name: string; description: string; }) {
        if (!group.name?.trim()) {
            throw new Error('Name is required');
        }
        if (!group.description?.trim()) {
            throw new Error('Description is required');
        }
    }

    private generateCode(): string {
        return uuidv4().substring(0, 6);
    }

    equals(group: Group): boolean {
        return this.name === group.getName() && this.description === group.getDescription();
    }
}
