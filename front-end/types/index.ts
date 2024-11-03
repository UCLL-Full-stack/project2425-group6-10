export type Group = {
    id: number;
    name: string;
    description: string;
    code: string;
}

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}