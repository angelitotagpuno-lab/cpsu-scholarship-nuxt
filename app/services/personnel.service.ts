import type { ApiResponse } from "~/types/api-response";
import type { Personnel } from "~/types/personnel";

const baseUrl = "/proxy";

function index(): Promise<ApiResponse<Personnel[]>> {
	return $fetch(baseUrl + "/api/personnels", {
		method: "GET",
		credentials: "include",
	});
}

function show(id: string): Promise<ApiResponse<Personnel>> {
	return $fetch(baseUrl + `/api/personnels/${id}`, {
		credentials: "include",
	});
}

function store(body: Personnel): Promise<ApiResponse<Personnel>> {
	return $fetch(baseUrl + "/api/personnels", {
		method: "POST",
		body: body,
		credentials: "include",
	});
}

function update(id: string, body: Personnel): Promise<ApiResponse<Personnel>> {
	return $fetch(baseUrl + `/api/personnels/${id}`, {
		method: "PUT",
		body: body,
		credentials: "include",
	});
}

function destroy(id: string): Promise<ApiResponse<Personnel>> {
	return $fetch(baseUrl + `/api/personnels/${id}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export const personnelService = {
	index,
	show,
	store,
	update,
	destroy,
};
