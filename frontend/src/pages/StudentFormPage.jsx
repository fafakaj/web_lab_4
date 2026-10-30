import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { of } from "rxjs";
import { createStudent, getStudent, updateStudent } from "../api/students.js";
import { errorMessage, fieldErrors } from "../api/http.js";
import { emptyStudent, toStudentForm, toStudentRequest, validateStudent } from "../domain/student.js";
import { loadWithStatus } from "../rx/fromRequest.js";
import { useObservable } from "../rx/useObservable.js";
import { useSubmit } from "../rx/useSubmit.js";
import StudentForm from "../components/StudentForm.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

export default function StudentFormPage() {
    const { isu } = useParams();
    const isEdit = Boolean(isu);
    const navigate = useNavigate();

    const initial$ = useMemo(
        () => (isEdit ? loadWithStatus((signal) => getStudent(isu, signal)) : of({ status: "success", data: null })),
        [isEdit, isu]
    );
    const loaded = useObservable(initial$, { status: "loading" });
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (loaded.status === "success") {
            setForm(loaded.data ? toStudentForm(loaded.data) : emptyStudent());
        }
    }, [loaded]);

    const { submit, pending, error } = useSubmit(async (value) => {
        const request = toStudentRequest(value);
        const saved = isEdit ? await updateStudent(isu, request) : await createStudent(request);
        navigate(`/students/${saved.isu_id}`);
    });

    if (loaded.status === "error" && (loaded.error.status === 404 || loaded.error.status === 422)) {
        return <NotFoundPage text={`Студент с ИСУ ${isu} не найден`} />;
    }
    if (loaded.status === "error") {
        return <ErrorMessage text={errorMessage(loaded.error)} />;
    }
    if (!form) {
        return <Loader />;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const found = validateStudent(form);
        setErrors(found);
        if (Object.keys(found).length === 0) {
            submit(form);
        }
    }

    return (
        <>
            <h2>{isEdit ? "Изменение данных студента" : "Новый студент"}</h2>
            <ErrorMessage text={errorMessage(error)} />
            <StudentForm
                value={form}
                errors={{ ...fieldErrors(error), ...errors }}
                isEdit={isEdit}
                pending={pending}
                onChange={setForm}
                onSubmit={handleSubmit}
            />
            <p><Link to={isEdit ? `/students/${isu}` : "/students"}>Отмена</Link></p>
        </>
    );
}
