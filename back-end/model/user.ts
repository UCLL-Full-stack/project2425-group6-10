import { group } from 'console';
import { Role } from '../types';
import { User as UserPrisma, Group as GroupPrisma } from '@prisma/client';
import { Group } from './group';

export class User {
    readonly id?: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role;
    readonly groups: Group[];

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        role: Role;
        groups: Group[];
    }) {
        this.validate(user);
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.groups = user.groups;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): Role {
        return this.role;
    }

    validate(user: { id?: number; username: string; email: string; password: string; role: Role }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
        if (!user.email.includes('@')) {
            throw new Error('Email must be a valid email format.');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (user.password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (user.role !== 'admin' && user.role !== 'student' && user.role !== 'lecturer') {
            throw new Error('Role must be either admin, lecturer or student');
        }
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.role === user.getRole()
        );
    }
    static from({
        id,
        username,
        password,
        email,
        role,
        groups,
    }: UserPrisma & { groups: GroupPrisma[] }) {
        return new User({
            id,
            username,
            password,
            email,
            role: role as Role,
            groups: groups.map((group) => Group.from(group)),
        });
    }
}
