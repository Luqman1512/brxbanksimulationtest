import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import LoginScreen from "./components/auth/LoginScreen";
import Dashboard from "./components/dashboard/Dashboard";
import { AuthProvider, useAuth } from "./components/auth/AuthContext";
import DemoModeBanner from "./components/common/DemoModeBanner";
import { Toaster } from "./components/ui/toaster";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <LoginScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <LoginScreen />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
