export default function ErrorMessage({ text }) {
    if (!text) {
        return null;
    }
    return <p className="form-error" role="alert">{text}</p>;
}
