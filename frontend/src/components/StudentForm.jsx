import { DORMITORIES } from "../domain/student.js";
import Field from "./Field.jsx";

export default function StudentForm({ value, errors, isEdit, pending, onChange, onSubmit }) {
    function handleChange(event) {
        const { name, type, checked } = event.target;
        onChange({ ...value, [name]: type === "checkbox" ? checked : event.target.value });
    }

    return (
        <form id="student-form" onSubmit={onSubmit} noValidate>
            <Field id="isu_id" label="ИСУ" error={errors.isu_id}>
                <input id="isu_id" name="isu_id" value={value.isu_id} onChange={handleChange} disabled={isEdit}
                       required maxLength={6} inputMode="numeric" placeholder="412345" />
            </Field>
            <Field id="full_name" label="ФИО" error={errors.full_name}>
                <input id="full_name" name="full_name" value={value.full_name} onChange={handleChange}
                       required minLength={5} maxLength={100} placeholder="Иванов Иван Иванович" />
            </Field>
            <Field id="group" label="Группа" error={errors.group}>
                <input id="group" name="group" value={value.group} onChange={handleChange}
                       required maxLength={5} placeholder="M3301" />
            </Field>
            <Field id="dormitory" label="Общежитие" error={errors.dormitory}>
                <select id="dormitory" name="dormitory" value={value.dormitory} onChange={handleChange} required>
                    <option value="">Выберите общежитие</option>
                    {Object.entries(DORMITORIES).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                    ))}
                </select>
            </Field>
            <Field id="room" label="Комната" error={errors.room}>
                <input id="room" name="room" value={value.room} onChange={handleChange}
                       required maxLength={4} inputMode="numeric" placeholder="1205" />
            </Field>
            <Field id="check_in" label="Дата заселения" error={errors.check_in}>
                <input id="check_in" name="check_in" type="date" value={value.check_in} onChange={handleChange}
                       required min="2000-01-01" />
            </Field>
            <Field id="check_out" label="Дата выселения (пусто — проживает сейчас)" error={errors.check_out}>
                <input id="check_out" name="check_out" type="date" value={value.check_out} onChange={handleChange}
                       min={value.check_in || "2000-01-01"} />
            </Field>
            <p>
                <label className="checkbox-label">
                    <input type="checkbox" name="is_foreign" checked={value.is_foreign} onChange={handleChange} />
                    {" "}Иностранный студент
                </label>
            </p>
            <Field id="notes" label="Заметки" error={errors.notes} wide>
                <textarea id="notes" name="notes" rows={4} value={value.notes} onChange={handleChange} maxLength={500} />
            </Field>
            <p className="form-row-wide">
                <button type="submit" className="button-primary" disabled={pending}>
                    {pending ? "Сохранение…" : isEdit ? "Сохранить изменения" : "Добавить студента"}
                </button>
            </p>
        </form>
    );
}
