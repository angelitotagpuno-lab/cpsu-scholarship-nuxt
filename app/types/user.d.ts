export type UserRole = "admin" | "personnel" | "staff" | "student";

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole | (string & {});
	createdAt?: string;
	updatedAt?: string;
}

export interface Auth {
	email: string;
	password: string;
}

export interface StudentLogin {
	studentNumber: string;
	password: string;
}

export interface StudentRegister {
	studentNumber: string;
	email: string;
	password: string;
}

export interface Student {
	id: string;
	userId: string;
	studentNumber: string;
	name: string;
	firstName: string;
	lastName: string;
	middleName?: string;
	extName?: string;
	courseId?: string;
	email: string;
	isScholar: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface StudentVerification {
	allowed: boolean;
	isRegistered: boolean;
	nextAction: string;
	student?: {
		studentNumber: string;
		name: string;
	};
}

export interface AuthResponse {
	user: User;
	student?: Student;
}

export interface AuthMeResponse {
	user: User;
	student?: Student;
	session?: {
		id: string;
		userId: string;
		expiresAt: string;
	};
	staff?: {
		id: string;
		userId: string;
		firstName: string;
		lastName: string;
		department: string;
		position: string;
		contactNumber?: string | null;
		createdAt?: string;
		updatedAt?: string;
	};
}

export interface RegisterResponse {
	user: User;
	access_token?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
}
