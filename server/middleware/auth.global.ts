import { defineEventHandler, getCookie, sendRedirect } from "h3";

export default defineEventHandler((event) => {
	const token = getCookie(event, "auth_token");
	const url = event.req.url ?? "";

	// Allow login page
	if (url.startsWith("/login")) return;

	// Block /admin if no token
	if (url.startsWith("/admin") && !token) {
		return sendRedirect(event, "/login");
	}
});
