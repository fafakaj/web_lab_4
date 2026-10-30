import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./state/AuthContext.jsx";
import Header from "./components/Header.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ListPage from "./pages/ListPage.jsx";
import StudentPage from "./pages/StudentPage.jsx";
import StudentFormPage from "./pages/StudentFormPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Navigate to="/students" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/students" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
                        <Route path="/students/new" element={<ProtectedRoute role="ADMIN"><StudentFormPage key="new" /></ProtectedRoute>} />
                        <Route path="/students/:isu" element={<ProtectedRoute><StudentPage /></ProtectedRoute>} />
                        <Route path="/students/:isu/edit" element={<ProtectedRoute role="ADMIN"><StudentFormPage key="edit" /></ProtectedRoute>} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
            </AuthProvider>
        </BrowserRouter>
    );
}
