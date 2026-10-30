const SESSION_KEY = "session";

export class ApiError extends Error {
    constructor(status, code, message, details = []) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

let onSessionExpired = () => {};

export function setSessionExpiredHandler(handler) {
    onSessionExpired = handler;
}

export function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
        return null;
    }
}

export function saveSession(tokens) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(tokens));
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

async function send(method, url, body, token, signal) {
    const headers = {};
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        return await fetch(url, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw error;
        }
        throw new ApiError(0, "NETWORK", "Сервер недоступен. Проверьте, что он запущен, и повторите попытку");
    }
}

async function readBody(response) {
    if (response.status === 204) {
        return null;
    }

    const data = await response.json().catch(() => null);
    if (response.ok) {
        return data;
    }

    const error = data?.error;
    throw new ApiError(
        response.status,
        error?.code ?? "UNKNOWN",
        error?.message ?? `Ошибка сервера (код ${response.status})`,
        error?.details ?? []
    );
}

let refreshing = null;

async function doRefresh() {
    const session = getSession();
    if (!session) {
        return false;
    }

    const response = await send("POST", "/api/auth/refresh", { refresh_token: session.refresh_token });
    if (!response.ok && response.status < 500) {
        return false;
    }

    const tokens = await readBody(response);
    if (getSession()?.refresh_token !== session.refresh_token) {
        return false;
    }
    saveSession(tokens);
    return true;
}

function refreshOnce(usedToken) {
    const session = getSession();
    if (!session) {
        return Promise.resolve(false);
    }
    if (session.access_token !== usedToken) {
        return Promise.resolve(true);
    }
    if (!refreshing) {
        refreshing = doRefresh().finally(() => {
            refreshing = null;
        });
    }
    return refreshing;
}

export async function request(method, url, body, signal) {
    const token = getSession()?.access_token;
    let response = await send(method, url, body, token, signal);

    if (response.status === 401) {
        if (token && await refreshOnce(token)) {
            response = await send(method, url, body, getSession()?.access_token, signal);
        }
        if (response.status === 401) {
            clearSession();
            onSessionExpired();
        }
    }

    return readBody(response);
}

export async function publicRequest(method, url, body) {
    return readBody(await send(method, url, body));
}

export function errorMessage(error) {
    if (!error) {
        return "";
    }
    if (!(error instanceof ApiError)) {
        return "Непредвиденная ошибка в приложении";
    }
    if (error.status === 403) {
        return "Недостаточно прав для этого действия";
    }
    if (error.status >= 502 && error.status <= 504) {
        return "Сервер недоступен. Проверьте, что он запущен, и повторите попытку";
    }
    if (error.status >= 500) {
        return "Внутренняя ошибка сервера. Попробуйте позже";
    }
    return error.message;
}

export function fieldErrors(error) {
    const errors = {};
    for (const detail of error?.details ?? []) {
        errors[detail.field] = detail.message;
    }
    return errors;
}
