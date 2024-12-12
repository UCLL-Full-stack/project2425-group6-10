export type Group = {
    id: number;
    name: string;
    description: string;
    code: string;
};

export type User = {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    role?: string;
    groups?: Group[];
};

export type StatusMessage = {
    message: string;
    type: "error" | "success";
};

export type Message = {
    id?: number;
    content?: string;
    date?: string;
  };
  