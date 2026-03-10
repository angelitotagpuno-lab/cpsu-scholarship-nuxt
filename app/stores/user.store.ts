export const userStore = defineStore("user-store", () => {
	const users = ref([]);

	return {
		users,
	};
});
