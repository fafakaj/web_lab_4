import { Link } from "react-router-dom";

export default function NotFoundPage({ text = "Такой страницы нет" }) {
    return (
        <>
            <h2>Не найдено</h2>
            <p>{text}</p>
            <p><Link to="/students">Вернуться к списку студентов</Link></p>
        </>
    );
}
