const PROTECTED_ROUTES = ["/admin", "/user"];

const PUBLIC_AUTH_ROUTES = ["/login", "/user-login", "/register", "/forgot-password"];

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();
	if (!authStore.user) {
		try {
			await authStore.getUser();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			// ignore errors here (especially 401)
		}
	}

	const isProtected = PROTECTED_ROUTES.some((route) => to.path.startsWith(route));
	const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(to.path);

	if (isPublicAuthRoute && !authStore.isAuthenticated) return;

	if (isProtected && !authStore.user) {
		return showError({ status: 404, statusText: "Page Not Found" });
	}

	if (isPublicAuthRoute && authStore.isAuthenticated) {
		return navigateTo(authStore.user?.role === "admin" ? "/admin/home" : "/user");
	}
});
