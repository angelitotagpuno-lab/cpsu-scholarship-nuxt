export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();
	if (!to.path.startsWith("/admin") && to.path !== "/login") return;
	if (!authStore.isAuthenticated) {
		await authStore.fetchUser();
	}
	if (to.path === "/login" && authStore.user) {
		return navigateTo("/admin/home");
	}
	if (to.path.startsWith("/admin") && !authStore.user) {
		return navigateTo("/login");
	}
});
