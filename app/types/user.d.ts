export type Role = "admin" | "student" | "staff";

export interface User {
	id?: number;
	email?: string;
	password?: string;
	role?: Role;
	accessToken?: string;
	refreshToken?: string;
}

export interface Auth {
	email: string;
	password: string;
}
