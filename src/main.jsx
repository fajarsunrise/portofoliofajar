import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import 'lenis/dist/lenis.css'
import App from './App.jsx'
import About from './pages/public/About.jsx'
import Projects from './pages/public/Projects.jsx'
import Contact from './pages/public/Contact.jsx'
import PreLoader from './components/PreLoader.jsx'
import LenisWrapper from './components/LenisWrapper.jsx'
import CursorSystem from './components/CursorSystem/CursorSystem.jsx'
import AdminLogin from './pages/admin/Login.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import "animate.css"
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CursorSystem />
    <PreLoader />
    <LenisWrapper>
      <div className="w-full overflow-x-hidden relative z-10 flex flex-col">
        <Routes>
          {/* Rute Publik: Portofolio Utama (App.jsx) */}
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />

          {/* Rute Admin: Halaman Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Rute Admin: Dashboard CMS (Terproteksi) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Rute Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LenisWrapper>
  </BrowserRouter>,
);
