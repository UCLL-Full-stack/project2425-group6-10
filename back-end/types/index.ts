export type Role = 'admin' | 'student' | 'lecturer';

export type GroupInput = {
    id?: number;
    name?: string;
    description?: string;
    code?: string;
};

export type UserInput = {
    id?: number;
    username?: string;
    email?: string;
    role?: string;
    password?: string;
    groups?: GroupInput[];
};

export type AuthenticationResponse = {
    token: string;
    username: string;
    role: string;
};
