export default function Field({ id, label, error, wide, children }) {
    return (
        <p className={wide ? "form-row-wide" : undefined}>
            <label htmlFor={id}>{label}</label>
            {children}
            {error && <span className="field-error">{error}</span>}
        </p>
    );
}
