import { useMemo } from "react";
import { getMe } from "../api/auth.js";
import { errorMessage } from "../api/http.js";
import { loadWithStatus } from "../rx/fromRequest.js";
import { useObservable } from "../rx/useObservable.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ProfilePage() {
    const me$ = useMemo(() => loadWithStatus(getMe), []);
    const { status, data, error } = useObservable(me$, { status: "loading" });

    return (
        <>
            <h2>Профиль</h2>
            {status === "loading" && <Loader />}
            {status === "error" && <ErrorMessage text={errorMessage(error)} />}
            {status === "success" && (
                <dl className="details">
                    <dt>Логин</dt>
                    <dd>{data.username}</dd>
                    <dt>Почта</dt>
                    <dd>{data.email}</dd>
                    <dt>Роль</dt>
                    <dd>{data.role === "ADMIN" ? "Администратор (ADMIN)" : "Пользователь (USER)"}</dd>
                    <dt>Права</dt>
                    <dd>{data.role === "ADMIN" ? "просмотр, создание, изменение и удаление студентов" : "только просмотр студентов"}</dd>
                    <dt>ID</dt>
                    <dd>{data.id}</dd>
                </dl>
            )}
        </>
    );
}
