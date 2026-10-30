export default function Loader({ text = "Загрузка…" }) {
    return <p className="loader" role="status">{text}</p>;
}
