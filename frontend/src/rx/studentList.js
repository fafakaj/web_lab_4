import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged, filter, map, merge, scan, switchMap } from "rxjs";
import { getStudents } from "../api/students.js";
import { loadWithStatus } from "./fromRequest.js";

export const DEFAULT_PARAMS = {
    full_name: "",
    group: "",
    dormitory: "",
    room: "",
    is_foreign: "",
    living: "",
    sort: "full_name",
    order: "asc",
    page: 1,
    size: 10,
};

export const INITIAL_LIST_STATE = { status: "loading", data: null, error: null };

function isComplete(params) {
    const name = params.full_name.trim();
    return name.length !== 1
        && (params.group === "" || /^[A-Za-z][0-9]{4}$/.test(params.group))
        && (params.room === "" || /^[1-9][0-9]{3}$/.test(params.room));
}

function toQuery(params) {
    return { ...params, full_name: params.full_name.trim().replace(/\s+/g, " ") };
}

export function createStudentList() {
    const params$ = new BehaviorSubject(DEFAULT_PARAMS);
    const reload$ = new Subject();

    const query$ = params$.pipe(
        debounceTime(300),
        filter(isComplete),
        map(toQuery),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );

    const state$ = merge(query$, reload$.pipe(map(() => toQuery(params$.value)))).pipe(
        switchMap((query) => loadWithStatus((signal) => getStudents(query, signal))),
        scan((previous, next) => ({ ...next, data: next.data ?? previous.data }), INITIAL_LIST_STATE)
    );

    return {
        params$,
        state$,
        setParams(patch) {
            params$.next({ ...params$.value, page: 1, ...patch });
        },
        reset() {
            params$.next(DEFAULT_PARAMS);
        },
        reload() {
            reload$.next();
        },
    };
}
