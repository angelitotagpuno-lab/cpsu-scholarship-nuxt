export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	createdAt?: string;
	updatedAt?: string;
	created_at?: string;
	updated_at?: string;
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
	createdAt: string;
	updatedAt: string;
}

export interface Staff {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	department?: string;
	position?: string;
	contactNumber?: string;
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

export interface AuthResponse {
	user: User;
	student?: Student;
}

export interface AuthMeResponse {
	user: User;
	session: {
		id: string;
		userId: string;
		expiresAt: string;
	};
	student?: Student;
	staff?: Staff;
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
