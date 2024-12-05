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
};
