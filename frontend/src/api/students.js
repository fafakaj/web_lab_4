import { request } from "./http.js";

const STUDENTS_URL = "/api/requests";

function studentUrl(isu) {
    return `${STUDENTS_URL}/${encodeURIComponent(isu)}`;
}

export function getStudents(params, signal) {
    const active = Object.entries(params).filter(([, value]) => value !== "" && value !== null);
    const query = new URLSearchParams(active).toString();
    return request("GET", query ? `${STUDENTS_URL}?${query}` : STUDENTS_URL, undefined, signal);
}

export function getStudent(isu, signal) {
    return request("GET", studentUrl(isu), undefined, signal);
}

export function createStudent(student) {
    return request("POST", STUDENTS_URL, student);
}

export function updateStudent(isu, student) {
    const { isu_id, ...fields } = student;
    return request("PUT", studentUrl(isu), fields);
}

export function deleteStudent(isu) {
    return request("DELETE", studentUrl(isu));
}
