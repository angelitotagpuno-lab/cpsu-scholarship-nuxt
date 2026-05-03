/* eslint-disable @typescript-eslint/no-explicit-any */
import camelize from "camelize";
import type { ScholarshipProgram } from "~/types/scholarship";

const config = useRuntimeConfig();

const API = `${config.public.baseUrl}/api/scholarship-programs`;

// 👉 helper to get token safely
function getToken() {
	if (import.meta.client) {
		return localStorage.getItem("token");
	}
	return null;
}

export async function create(payload: any) {
	const token = getToken();

	const res = await $fetch<any>(API, {
		method: "POST",
		body: payload,
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});

	return camelize(res.data);
}

function normalize(item: any): ScholarshipProgram {
	return {
		...item,
		defaultAmountPerSemester: Number(item.defaultAmountPerSemester),
	};
}

export async function getAll(): Promise<ScholarshipProgram[]> {
	const token = getToken();

	const res = await $fetch<any>(API, {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});

	return camelize(res.data).map(normalize);
}

export async function update(id: string, payload: Partial<ScholarshipProgram>) {
	const token = getToken();

	const res = await $fetch<any>(`${API}/${id}`, {
		method: "PUT",
		body: payload,
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});

	return normalize(camelize(res.data));
}

export async function remove(id: string) {
	const token = getToken();

	await $fetch(`${API}/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
}
