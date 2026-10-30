export const DORMITORIES = {
    sg: "Студенческий городок",
    alp: "Общежитие № 2 (Альпийская)",
    bel: "Общежитие № 3 (Белорусская)",
    len: "Общежитие № 4 (Ленсовета)",
    msg: "Межвузовский студенческий городок",
};

export const SORT_FIELDS = {
    full_name: "ФИО",
    group: "Группе",
    isu_id: "ИСУ",
    dormitory: "Общежитию",
    room: "Комнате",
    check_in: "Дате заселения",
    check_out: "Дате выселения",
};

export const PATTERNS = {
    isu: /^[0-9]{6}$/,
    group: /^[A-Z][0-9]{4}$/,
    nameSearch: /^[A-Za-zА-ЯЁа-яё' -]{2,}$/,
    room: /^[1-9][0-9]{3}$/,
    fullName: /^[A-Za-zА-ЯЁа-яё]+(?:['-][A-Za-zА-ЯЁа-яё]+)*(?: [A-Za-zА-ЯЁа-яё]+(?:['-][A-Za-zА-ЯЁа-яё]+)*)+$/,
    username: /^[a-z0-9_]{3,32}$/,
    email: /^.+@.+\..+$/,
};

const MAX_STAY_YEARS = 9;

function today() {
    return new Date().toISOString().slice(0, 10);
}

function addYears(isoDate, years) {
    const date = new Date(`${isoDate}T00:00:00Z`);
    date.setUTCFullYear(date.getUTCFullYear() + years);
    return date.toISOString().slice(0, 10);
}

export function getDormitoryName(code) {
    return DORMITORIES[code] || "—";
}

export function formatDate(isoDate) {
    if (!isoDate) {
        return "";
    }
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
}

export function formatPeriod(from, to) {
    if (!to) {
        return `${formatDate(from)} — по настоящее время`;
    }
    return `${formatDate(from)} — ${formatDate(to)}`;
}

export function emptyStudent() {
    return {
        isu_id: "",
        full_name: "",
        group: "",
        dormitory: "",
        room: "",
        check_in: "",
        check_out: "",
        is_foreign: false,
        notes: "",
    };
}

export function toStudentForm(student) {
    return { ...student, check_out: student.check_out ?? "", notes: student.notes ?? "" };
}

export function toStudentRequest(form) {
    return {
        isu_id: form.isu_id,
        full_name: form.full_name.trim().replace(/\s+/g, " "),
        group: form.group.trim().toUpperCase(),
        dormitory: form.dormitory,
        room: form.room.trim(),
        check_in: form.check_in,
        check_out: form.check_out || null,
        is_foreign: form.is_foreign,
        notes: form.notes.trim(),
    };
}

export function validateStudent(form) {
    const student = toStudentRequest(form);
    const errors = {};

    if (!PATTERNS.isu.test(student.isu_id)) {
        errors.isu_id = "ИСУ — ровно 6 цифр, например 412345";
    }
    if (student.full_name.length < 5 || student.full_name.length > 100 || !PATTERNS.fullName.test(student.full_name)) {
        errors.full_name = "ФИО — минимум два слова из букв, от 5 до 100 символов";
    }
    if (!PATTERNS.group.test(student.group)) {
        errors.group = "Группа — латинская буква и 4 цифры, например M3301";
    }
    if (!DORMITORIES[student.dormitory]) {
        errors.dormitory = "Выберите общежитие";
    }
    if (!PATTERNS.room.test(student.room)) {
        errors.room = "Комната — ровно 4 цифры, первая не 0, например 1205";
    }
    const latestCheckIn = addYears(today(), 1);
    if (!student.check_in) {
        errors.check_in = "Обязательное поле";
    } else if (student.check_in < "2000-01-01" || student.check_in > latestCheckIn) {
        errors.check_in = `Дата заселения — от 01.01.2000 до ${formatDate(latestCheckIn)}`;
    }
    if (student.check_out && student.check_in && student.check_out <= student.check_in) {
        errors.check_out = "Дата выселения должна быть позже даты заселения";
    } else if (student.check_out && student.check_in && student.check_out > addYears(student.check_in, MAX_STAY_YEARS)) {
        errors.check_out = `Дата выселения — не позже ${formatDate(addYears(student.check_in, MAX_STAY_YEARS))}: `
            + `проживание не дольше ${MAX_STAY_YEARS} лет`;
    }
    if (student.notes.length > 500) {
        errors.notes = "Заметки — не длиннее 500 символов";
    }
    return errors;
}

export function validateRegister(form) {
    const errors = {};

    if (!PATTERNS.username.test(form.username.trim().toLowerCase())) {
        errors.username = "Логин — от 3 до 32 символов: латинские буквы, цифры и _";
    }
    if (!PATTERNS.email.test(form.email.trim())) {
        errors.email = "Почта — адрес вида name@example.com";
    }
    if (form.password.length < 8 || form.password.length > 64) {
        errors.password = "Пароль — от 8 до 64 символов";
    } else if (!/[A-Za-zА-ЯЁа-яё]/.test(form.password) || !/[0-9]/.test(form.password)) {
        errors.password = "Пароль должен содержать хотя бы одну букву и одну цифру";
    }
    if (form.password !== form.password2) {
        errors.password2 = "Пароли не совпадают";
    }
    return errors;
}
