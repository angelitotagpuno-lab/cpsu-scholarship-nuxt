export interface ApiResponse<T> {
	data: T;
	error: any;
	success: boolean;
}
