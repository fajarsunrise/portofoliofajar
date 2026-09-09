import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'lenis/dist/lenis.css'
import App from './App.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PreLoader from './components/PreLoader.jsx'
import LenisWrapper from './components/LenisWrapper.jsx'
import CursorSystem from './components/CursorSystem/CursorSystem.jsx'
import "animate.css"
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

AOS.init();

createRoot(document.getElementById('root')).render(
  <>
    <PreLoader/>
    <CursorSystem />
    <LenisWrapper>
      <div className="container mx-auto px-4 sm:px-6 max-w-full overflow-x-hidden relative z-10">
        <Navbar />
        <App />
        <Footer/>
      </div>
    </LenisWrapper>
  </>,
)
