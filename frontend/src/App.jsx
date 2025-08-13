import { Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <div className="h-full w-full bg-[#0a0a0a] text-white font-sans relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#00ffe1]/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#3f89fa]/10 rounded-full blur-[140px] animate-pulse pointer-events-none z-0" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#bdc5e1] via-[#cacad3] to-[#ffffff] opacity-[0.97] pointer-events-none z-0" />

        <div className="relative z-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;