import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { useSubmit } from "../rx/useSubmit.js";
import { errorMessage } from "../api/http.js";
import Field from "../components/Field.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function LoginPage() {
    const { user, login, notice } = useAuth();
    const location = useLocation();
    const [form, setForm] = useState({ username: "", password: "" });
    const { submit, pending, error } = useSubmit((data) => login(data.username, data.password));

    if (user) {
        return <Navigate to={location.state?.from ?? "/students"} replace />;
    }

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        submit(form);
    }

    return (
        <>
            <h2>Вход</h2>
            {notice && <p className="notice">{notice}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <Field id="username" label="Логин">
                    <input id="username" name="username" value={form.username} onChange={handleChange}
                           required autoComplete="username" />
                </Field>
                <Field id="password" label="Пароль">
                    <input id="password" name="password" type="password" value={form.password}
                           onChange={handleChange} required autoComplete="current-password" />
                </Field>
                <ErrorMessage text={errorMessage(error)} />
                <p>
                    <button type="submit" className="button-primary" disabled={pending}>
                        {pending ? "Вход…" : "Войти"}
                    </button>
                </p>
            </form>
            <p>Нет учётной записи? <Link to="/register">Зарегистрируйтесь</Link></p>
        </>
    );
}
