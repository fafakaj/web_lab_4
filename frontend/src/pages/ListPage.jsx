import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { createStudentList, DEFAULT_PARAMS, INITIAL_LIST_STATE } from "../rx/studentList.js";
import { useObservable } from "../rx/useObservable.js";
import { useSubmit } from "../rx/useSubmit.js";
import { deleteStudent } from "../api/students.js";
import { errorMessage } from "../api/http.js";
import Filters from "../components/Filters.jsx";
import StudentTable from "../components/StudentTable.jsx";
import Pagination from "../components/Pagination.jsx";
import Loader from "../components/Loader.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function ListPage() {
    const { isAdmin } = useAuth();
    const list = useMemo(() => createStudentList(), []);
    const params = useObservable(list.params$, DEFAULT_PARAMS);
    const { status, data, error } = useObservable(list.state$, INITIAL_LIST_STATE);
    const [confirmIsu, setConfirmIsu] = useState(null);

    const removal = useSubmit(async (isu) => {
        await deleteStudent(isu);
        setConfirmIsu(null);
        list.reload();
    });

    useEffect(() => {
        if (status === "success" && data.items.length === 0 && data.page > 1) {
            list.setParams({ page: data.page - 1 });
        }
    }, [status, data, list]);

    return (
        <>
            <h2>Список студентов</h2>
            {isAdmin && (
                <p><Link className="button button-primary" to="/students/new">Добавить студента</Link></p>
            )}
            <Filters params={params} onChange={list.setParams} onReset={list.reset} />
            {status === "loading" && <Loader />}
            {status === "error" && <ErrorMessage text={errorMessage(error)} />}
            <ErrorMessage text={errorMessage(removal.error)} />
            {data && (
                <>
                    <StudentTable
                        students={data.items}
                        isAdmin={isAdmin}
                        confirmIsu={confirmIsu}
                        deleting={removal.pending}
                        onAskDelete={(isu) => {
                            removal.clearError();
                            setConfirmIsu(isu);
                        }}
                        onCancelDelete={() => setConfirmIsu(null)}
                        onDelete={removal.submit}
                    />
                    <Pagination page={data.page} size={data.size} total={data.total}
                                onPage={(page) => list.setParams({ page })} />
                </>
            )}
        </>
    );
}
