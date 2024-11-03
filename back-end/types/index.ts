export type Role = 'admin' | 'student' | 'lecturer';


export type GroupInput = {
    id?: number;
    name?: string;
    description?: string;
    code?: string;
}

export type UserInput = {
    id?: number;
    username?: string;
    email?: string;
    role?: string;
}

export type UserDTO = {
    id: number;
    username: string;
    email: string;
    role: string;
    groups: { id: number; name: string }[];
}

export type GroupDTO = {
    id: number;
    name: string;
    description: string;
    code: string;
    users: { id: number; username: string }[];
}
