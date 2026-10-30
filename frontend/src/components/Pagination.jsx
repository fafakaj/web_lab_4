export default function Pagination({ page, size, total, onPage }) {
    const pages = Math.max(1, Math.ceil(total / size));

    return (
        <div className="pagination">
            <span>Страница {page} из {pages}, всего студентов: {total}</span>
            <span>
                <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>← Назад</button>
                {" "}
                <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>Вперёд →</button>
            </span>
        </div>
    );
}
