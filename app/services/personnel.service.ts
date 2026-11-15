import type {
	Personnel,
	CreatePersonnel,
	UpdatePersonnel,
	PersonnelListResponse,
	PersonnelQuery,
} from "~/types/personnel";

const baseUrl = "/proxy/api/v1/personnels";

function index(query: PersonnelQuery = {}): Promise<PersonnelListResponse> {
	return $fetch(baseUrl, {
		method: "GET",
		query,
		credentials: "include",
	});
}

function show(id: string): Promise<Personnel> {
	return $fetch(`${baseUrl}/${id}`, {
		method: "GET",
		credentials: "include",
	});
}

function store(body: CreatePersonnel): Promise<Personnel> {
	return $fetch(baseUrl, {
		method: "POST",
		body,
		credentials: "include",
	});
}

function update(id: string, body: UpdatePersonnel): Promise<Personnel> {
	return $fetch(`${baseUrl}/${id}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

function destroy(id: string): Promise<void> {
	return $fetch(`${baseUrl}/${id}`, {
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
