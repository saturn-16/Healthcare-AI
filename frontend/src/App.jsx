import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "./context/LanguageContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AIConsultation from "./pages/AIConsultation";
import SymptomChecker from "./pages/SymptomChecker";
import PlaceholderPage from "./pages/PlaceholderPage";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="consultation" element={<AIConsultation />} />
          <Route path="symptoms" element={<SymptomChecker />} />
          <Route path="history" element={<PlaceholderPage title="Health History" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
