import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function Header() {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <header>
            <div className="header-row">
                <h1><Link to="/students" className="title-link">Управление студентами</Link></h1>
                {user && (
                    <p className="user-panel">
                        <span>{user.username} ({user.role})</span>
                        <button type="button" onClick={handleLogout}>Выйти</button>
                    </p>
                )}
            </div>
            <nav>
                {user ? (
                    <>
                        <NavLink to="/students" end>Список студентов</NavLink>
                        {isAdmin && <NavLink to="/students/new">Добавить студента</NavLink>}
                        <NavLink to="/profile">Профиль</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Вход</NavLink>
                        <NavLink to="/register">Регистрация</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}
