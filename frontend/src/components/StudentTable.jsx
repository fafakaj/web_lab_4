import { Link } from "react-router-dom";
import { formatPeriod, getDormitoryName } from "../domain/student.js";

export default function StudentTable({ students, isAdmin, confirmIsu, deleting, onAskDelete, onCancelDelete, onDelete }) {
    if (students.length === 0) {
        return <p>Студенты не найдены. Измените фильтры.</p>;
    }

    return (
        <table id="students-table">
            <thead>
                <tr>
                    <th>ФИО</th>
                    <th>ИСУ</th>
                    <th>Группа</th>
                    <th>Общежитие</th>
                    <th>Комната</th>
                    <th>Проживание</th>
                    <th>Иностранец</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student.isu_id}>
                        <td data-label="ФИО">{student.full_name}</td>
                        <td data-label="ИСУ">{student.isu_id}</td>
                        <td data-label="Группа">{student.group}</td>
                        <td data-label="Общежитие">{getDormitoryName(student.dormitory)}</td>
                        <td data-label="Комната">{student.room}</td>
                        <td data-label="Проживание">{formatPeriod(student.check_in, student.check_out)}</td>
                        <td data-label="Иностранец">{student.is_foreign ? "Да" : "Нет"}</td>
                        <td>
                            <Link to={`/students/${student.isu_id}`}>Досье</Link>
                            {isAdmin && confirmIsu !== student.isu_id && (
                                <>
                                    <Link to={`/students/${student.isu_id}/edit`}>Изменить</Link>
                                    <button type="button" className="button-danger" onClick={() => onAskDelete(student.isu_id)}>
                                        Удалить
                                    </button>
                                </>
                            )}
                            {isAdmin && confirmIsu === student.isu_id && (
                                <span className="confirm">
                                    Удалить?
                                    <button type="button" className="button-danger" disabled={deleting}
                                            onClick={() => onDelete(student.isu_id)}>
                                        {deleting ? "Удаление…" : "Да"}
                                    </button>
                                    <button type="button" disabled={deleting} onClick={onCancelDelete}>Нет</button>
                                </span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
