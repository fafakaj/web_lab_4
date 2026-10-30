import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { deleteStudent, getStudent } from "../api/students.js";
import { errorMessage } from "../api/http.js";
import { formatDate, getDormitoryName } from "../domain/student.js";
import { loadWithStatus } from "../rx/fromRequest.js";
import { useObservable } from "../rx/useObservable.js";
import { useSubmit } from "../rx/useSubmit.js";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

export default function StudentPage() {
    const { isu } = useParams();
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const student$ = useMemo(() => loadWithStatus((signal) => getStudent(isu, signal)), [isu]);
    const { status, data, error } = useObservable(student$, { status: "loading" });
    const [confirming, setConfirming] = useState(false);
    const removal = useSubmit(async () => {
        await deleteStudent(isu);
        navigate("/students");
    });

    if (status === "loading") {
        return <Loader />;
    }
    if (status === "error" && (error.status === 404 || error.status === 422)) {
        return <NotFoundPage text={`Студент с ИСУ ${isu} не найден`} />;
    }
    if (status === "error") {
        return <ErrorMessage text={errorMessage(error)} />;
    }

    return (
        <>
            <h2>Досье студента</h2>
            <dl className="details">
                <dt>ФИО</dt>
                <dd>{data.full_name}</dd>
                <dt>ИСУ</dt>
                <dd>{data.isu_id}</dd>
                <dt>Группа</dt>
                <dd>{data.group}</dd>
                <dt>Общежитие</dt>
                <dd>{getDormitoryName(data.dormitory)}</dd>
                <dt>Комната</dt>
                <dd>{data.room}</dd>
                <dt>Дата заселения</dt>
                <dd>{formatDate(data.check_in)}</dd>
                <dt>Дата выселения</dt>
                <dd>{data.check_out ? formatDate(data.check_out) : "проживает сейчас"}</dd>
                <dt>Иностранец</dt>
                <dd>{data.is_foreign ? "Да" : "Нет"}</dd>
                <dt>Заметки</dt>
                <dd>{data.notes || "—"}</dd>
            </dl>
            <ErrorMessage text={errorMessage(removal.error)} />
            <p className="actions">
                <Link to="/students">← К списку</Link>
                {isAdmin && !confirming && (
                    <>
                        <Link className="button" to={`/students/${isu}/edit`}>Изменить</Link>
                        <button type="button" className="button-danger" onClick={() => setConfirming(true)}>Удалить</button>
                    </>
                )}
                {isAdmin && confirming && (
                    <span className="confirm">
                        Удалить студента?
                        <button type="button" className="button-danger" disabled={removal.pending} onClick={() => removal.submit()}>
                            {removal.pending ? "Удаление…" : "Да"}
                        </button>
                        <button type="button" disabled={removal.pending} onClick={() => setConfirming(false)}>Нет</button>
                    </span>
                )}
            </p>
        </>
    );
}
