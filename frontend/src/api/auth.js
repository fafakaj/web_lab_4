import { clearSession, getSession, publicRequest, request, saveSession } from "./http.js";

export async function login(username, password) {
    const tokens = await publicRequest("POST", "/api/auth/login", { username, password });
    saveSession(tokens);
    return tokens.user;
}

export function register(username, email, password) {
    return publicRequest("POST", "/api/auth/register", { username, email, password });
}

export function logout() {
    const session = getSession();
    clearSession();
    if (session) {
        publicRequest("POST", "/api/auth/logout", { refresh_token: session.refresh_token }).catch(() => null);
    }
}

export function getMe(signal) {
    return request("GET", "/api/auth/me", undefined, signal);
}
