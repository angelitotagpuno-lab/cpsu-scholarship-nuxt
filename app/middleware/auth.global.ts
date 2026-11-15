const PROTECTED_ROUTES = ["/admin", "/user"];

const PUBLIC_AUTH_ROUTES = ["/login", "/user-login", "/register", "/forgot-password"];

const ADMIN_ROLES = ["admin", "personnel", "staff"];

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();

	const isProtected = PROTECTED_ROUTES.some(
		(route) => to.path === route || to.path.startsWith(`${route}/`),
	);

	const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(to.path);

	if (isProtected && !authStore.isAuthenticated) {
		await authStore.getUser();
	}

	const role = authStore.user?.role?.toLowerCase() || "";

	const isAdmin = ADMIN_ROLES.includes(role);

	const isStudent = role === "student";

	if (isPublicAuthRoute) {
		if (authStore.isAuthenticated) {
			if (isAdmin) {
				return navigateTo("/admin/home");
			}

			if (isStudent) {
				return navigateTo("/user");
			}
		}

		return;
	}

	if (!isProtected) return;

	if (!authStore.isAuthenticated) {
		return navigateTo(to.path.startsWith("/admin") ? "/login" : "/user-login");
	}

	if (to.path.startsWith("/admin") && !isAdmin) {
		return navigateTo(isStudent ? "/user" : "/login");
	}

	if (to.path.startsWith("/user") && !isStudent) {
		return navigateTo(isAdmin ? "/admin/home" : "/user-login");
	}
});
