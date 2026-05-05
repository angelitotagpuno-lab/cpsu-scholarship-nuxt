export interface User {
	id: string;
	email: string;
	role: string;
	created_at: string;
	updated_at: string;
}

export interface RegisterResponse {
	user: User;
	access_token: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
}

export interface Auth {
	email: string;
	password: string;
}
