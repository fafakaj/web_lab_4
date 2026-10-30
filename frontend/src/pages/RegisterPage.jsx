import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { useSubmit } from "../rx/useSubmit.js";
import { errorMessage, fieldErrors } from "../api/http.js";
import { validateRegister } from "../domain/student.js";
import Field from "../components/Field.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function RegisterPage() {
    const { user, register } = useAuth();
    const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
    const [errors, setErrors] = useState({});
    const { submit, pending, error } = useSubmit((data) => register(data.username, data.email, data.password));

    if (user) {
        return <Navigate to="/students" replace />;
    }

    const shown = { ...fieldErrors(error), ...errors };

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        const found = validateRegister(form);
        setErrors(found);
        if (Object.keys(found).length === 0) {
            submit({ ...form, username: form.username.trim().toLowerCase(), email: form.email.trim() });
        }
    }

    return (
        <>
            <h2>Регистрация</h2>
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <Field id="username" label="Логин" error={shown.username}>
                    <input id="username" name="username" value={form.username} onChange={handleChange}
                           required minLength={3} maxLength={32} autoComplete="username" />
                </Field>
                <Field id="email" label="Почта" error={shown.email}>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                           required maxLength={254} autoComplete="email" />
                </Field>
                <Field id="password" label="Пароль" error={shown.password}>
                    <input id="password" name="password" type="password" value={form.password}
                           onChange={handleChange} required minLength={8} maxLength={64}
                           autoComplete="new-password" />
                </Field>
                <Field id="password2" label="Пароль ещё раз" error={shown.password2}>
                    <input id="password2" name="password2" type="password" value={form.password2}
                           onChange={handleChange} required autoComplete="new-password" />
                </Field>
                <ErrorMessage text={errorMessage(error)} />
                <p>
                    <button type="submit" className="button-primary" disabled={pending}>
                        {pending ? "Регистрация…" : "Зарегистрироваться"}
                    </button>
                </p>
            </form>
            <p>Уже есть учётная запись? <Link to="/login">Войдите</Link></p>
        </>
    );
}
