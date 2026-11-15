export interface UploadFileResponse {
	id?: string;
	filename?: string;
	url?: string;
	message?: string;
	[key: string]: unknown;
}

export interface UploadFileResult {
	name: string;
	success: boolean;
	data?: UploadFileResponse;
	error?: string;
}
