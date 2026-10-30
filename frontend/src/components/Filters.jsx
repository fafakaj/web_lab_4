import { DORMITORIES, PATTERNS, SORT_FIELDS } from "../domain/student.js";

export default function Filters({ params, onChange, onReset }) {
    function handleChange(event) {
        const { name, value } = event.target;
        onChange({ [name]: name === "size" ? Number(value) : value });
    }

    return (
        <form className="filters" onSubmit={(event) => event.preventDefault()}>
            <p>
                <label htmlFor="filter-full_name">Поиск по ФИО</label>
                <input id="filter-full_name" name="full_name" value={params.full_name} onChange={handleChange}
                       maxLength={100} pattern={PATTERNS.nameSearch.source} placeholder="Иванов" />
            </p>
            <p>
                <label htmlFor="filter-group">Группа</label>
                <input id="filter-group" name="group" value={params.group} onChange={handleChange}
                       maxLength={5} pattern="[A-Za-z][0-9]{4}" placeholder="M3301" />
            </p>
            <p>
                <label htmlFor="filter-dormitory">Общежитие</label>
                <select id="filter-dormitory" name="dormitory" value={params.dormitory} onChange={handleChange}>
                    <option value="">Все</option>
                    {Object.entries(DORMITORIES).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                    ))}
                </select>
            </p>
            <p>
                <label htmlFor="filter-room">Комната</label>
                <input id="filter-room" name="room" value={params.room} onChange={handleChange}
                       maxLength={4} pattern={PATTERNS.room.source} inputMode="numeric" placeholder="1205" />
            </p>
            <p>
                <label htmlFor="filter-is_foreign">Иностранец</label>
                <select id="filter-is_foreign" name="is_foreign" value={params.is_foreign} onChange={handleChange}>
                    <option value="">Все</option>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </p>
            <p>
                <label htmlFor="filter-living">Проживает сейчас</label>
                <select id="filter-living" name="living" value={params.living} onChange={handleChange}>
                    <option value="">Все</option>
                    <option value="true">Да</option>
                    <option value="false">Нет</option>
                </select>
            </p>
            <p>
                <label htmlFor="filter-sort">Сортировать по</label>
                <select id="filter-sort" name="sort" value={params.sort} onChange={handleChange}>
                    {Object.entries(SORT_FIELDS).map(([field, name]) => (
                        <option key={field} value={field}>{name}</option>
                    ))}
                </select>
            </p>
            <p>
                <label htmlFor="filter-order">Порядок</label>
                <select id="filter-order" name="order" value={params.order} onChange={handleChange}>
                    <option value="asc">По возрастанию</option>
                    <option value="desc">По убыванию</option>
                </select>
            </p>
            <p>
                <label htmlFor="filter-size">Студентов на странице</label>
                <select id="filter-size" name="size" value={params.size} onChange={handleChange}>
                    {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
            </p>
            <p className="filters-actions">
                <button type="button" onClick={onReset}>Сбросить фильтры</button>
            </p>
        </form>
    );
}
