import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import ErrorMessage from "./ErrorMessage.jsx";

export default function ProtectedRoute({ role, children }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
    }
    if (role && user.role !== role) {
        return (
            <>
                <h2>Нет доступа</h2>
                <ErrorMessage text="Недостаточно прав для этого действия" />
            </>
        );
    }
    return children;
}
