const PROTECTED_ROUTES = ["/admin", "/user"];

const PUBLIC_AUTH_ROUTES = ["/login", "/user-login", "/register", "/forgot-password"];

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();

	const isProtected = PROTECTED_ROUTES.some(
		(route) => to.path === route || to.path.startsWith(`${route}/`),
	);

	const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(to.path);

	if (isPublicAuthRoute) {
		if (authStore.isAuthenticated) {
			const role = authStore.user?.role.toLowerCase();

			return navigateTo(["admin", "staff"].includes(role || "") ? "/admin/home" : "/user");
		}

		return;
	}

	if (!isProtected) return;

	if (!authStore.isAuthenticated) {
		await authStore.getUser();
	}

	if (!authStore.isAuthenticated) {
		return navigateTo(to.path.startsWith("/admin") ? "/login" : "/user-login");
	}

	const role = authStore.user?.role.toLowerCase();

	if (to.path.startsWith("/admin") && !["admin", "staff"].includes(role || "")) {
		return navigateTo("/user");
	}

	if (to.path.startsWith("/user") && role !== "student") {
		return navigateTo("/admin/home");
	}
});
