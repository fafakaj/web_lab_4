import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.js";
import { getSession, setSessionExpiredHandler } from "../api/http.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getSession()?.user ?? null);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        setSessionExpiredHandler(() => {
            setUser(null);
            setNotice("Сессия истекла, войдите снова");
        });
    }, []);

    const value = useMemo(() => {
        async function login(username, password) {
            const loggedIn = await authApi.login(username, password);
            setNotice("");
            setUser(loggedIn);
        }

        async function register(username, email, password) {
            await authApi.register(username, email, password);
            await login(username, password);
        }

        async function logout() {
            await authApi.logout();
            setUser(null);
        }

        return { user, isAdmin: user?.role === "ADMIN", notice, login, register, logout };
    }, [user, notice]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
