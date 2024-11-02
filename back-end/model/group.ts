import { v4 as uuidv4 } from 'uuid';

export class Group {
    private id?: number;
    private name: string;
    private description: string;
    private code: string;

    constructor(group: { 
        id: number; 
        name: string; 
        description: string; 
    }) {
        this.validate(group);
        this.id = group.id;
        this.name = group.name;
        this.description = group.description;
        this.code = this.generateCode();
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
