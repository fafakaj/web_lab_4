import { BehaviorSubject, Subject, combineLatest, debounceTime, distinctUntilChanged, filter, map, scan, startWith, switchMap } from "rxjs";
import { getStudents } from "../api/students.js";
import { normalizeName, PATTERNS } from "../domain/student.js";
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

function toQuery(params) {
    return { ...params, full_name: normalizeName(params.full_name), group: params.group.toUpperCase() };
}

function isReadyToSearch(query) {
    return (query.full_name === "" || PATTERNS.nameSearch.test(query.full_name))
        && (query.group === "" || PATTERNS.group.test(query.group))
        && (query.room === "" || PATTERNS.room.test(query.room));
}

function sameQuery(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function createStudentList() {
    const params$ = new BehaviorSubject(DEFAULT_PARAMS);
    const reload$ = new Subject();

    const query$ = params$.pipe(
        debounceTime(300),
        map(toQuery),
        filter(isReadyToSearch),
        distinctUntilChanged(sameQuery)
    );

    const state$ = combineLatest([query$, reload$.pipe(startWith(null))]).pipe(
        switchMap(([query]) => loadWithStatus((signal) => getStudents(query, signal))),
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
