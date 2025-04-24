import { FC, useEffect, useState } from "react";
import { Link } from "react-scroll";
import { Link as LinkNavigate } from "react-router-dom";
// Components
import Sidebar from "./Sidebar";
import Backdrop from "../Elements/Backdrop";
// Assets
import LogoIcon from "../../../assets/svg/Logo.jsx";
import BurgerIcon from "../../../assets/svg/BurgerIcon.jsx";
import { useHandleModal } from "../../hooks/useHandleModal.js";
import AuthModal from "../Modals/AuthModal.js";

// Breakpoint para dispositivos móviles (768px para md en Tailwind por defecto)
const MOBILE_BREAKPOINT = 768;

const TopNavbar: FC = () => {
  const { isOpen, handleOpenModal, handleCloseModal, mode, setMode } = useHandleModal();
  const [y, setY] = useState<number>(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [y]);

  // Manejar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Si la pantalla es más grande que el breakpoint y el sidebar está abierto, cerrarlo
      if (window.innerWidth >= MOBILE_BREAKPOINT && sidebarOpen) {
        toggleSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen, windowWidth]);

  // Estilos para los ítems del menú
  const navLinkClasses = "px-[8px] lg:px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF] font-semibold";
  
  // Estilos para los ítems seleccionados
  const navLinkActiveClasses = "text-[#7620FF] border-b-2 border-[#7620FF]";

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} toggleModal={handleOpenModal} />
      {sidebarOpen && <Backdrop toggleSidebar={toggleSidebar} />}
      <nav 
        className={`fixed top-0 left-0 w-full flex items-center justify-center bg-white z-[999] transition-all duration-300 ${
          y > 100 ? "h-[60px]" : "h-[80px]"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-full relative">
          <Link className="cursor-pointer flex items-center shrink-0" to="home" smooth={true}>
            <LogoIcon />
            <h1 className="ml-[15px] text-xl font-extrabold">
              HomeCooKing
            </h1>
          </Link>
          <button 
            className="outline-none border-0 bg-transparent h-full px-[15px] block md:hidden cursor-pointer"
            onClick={() => toggleSidebar(!sidebarOpen)}
          >
            <BurgerIcon />
          </button>
          <ul className="hidden md:flex flex-wrap justify-center gap-1 lg:gap-2">
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <Link 
                activeClass={navLinkActiveClasses} 
                className={navLinkClasses} 
                to="home" 
                spy={true} 
                smooth={true} 
                offset={-80}
              >
                Home
              </Link>
            </li>
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <Link 
                activeClass={navLinkActiveClasses} 
                className={navLinkClasses} 
                to="services" 
                spy={true} 
                smooth={true} 
                offset={-80}
              >
                Services
              </Link>
            </li>
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <Link 
                activeClass={navLinkActiveClasses} 
                className={navLinkClasses} 
                to="menu" 
                spy={true} 
                smooth={true} 
                offset={-80}
              >
                Menú
              </Link>
            </li>
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <Link 
                activeClass={navLinkActiveClasses} 
                className={navLinkClasses}
                to="testimonials" 
                spy={true} 
                smooth={true} 
                offset={-80}
              >
                Testimonios
              </Link>
            </li>
           {/*  <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <Link 
                activeClass={navLinkActiveClasses} 
                className={navLinkClasses}
                to="pricing" 
                spy={true} 
                smooth={true} 
                offset={-80}
              >
                Pricing
              </Link>
            </li>
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <Link 
                activeClass={navLinkActiveClasses} 
                className={navLinkClasses}
                to="contact" 
                spy={true} 
                smooth={true} 
                offset={-80}
              >
                Contact
              </Link>
            </li> */}
          </ul>
          <ul className="hidden md:flex items-center gap-2 shrink-0">
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <button onClick={() => handleOpenModal("login")} className="px-[8px] lg:px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF] cursor-pointer">
                Acceder
              </button>
            </li>
            <li className="font-semibold text-[14px] lg:text-[15px] cursor-pointer">
              <LinkNavigate to="/preferences" className="rounded-lg bg-[#f2f2f2] px-[10px] lg:px-[15px] py-[8px] lg:py-[10px] hover:bg-[#7620FF] hover:text-white transition-all duration-300 cursor-pointer">
                Comenzar
              </LinkNavigate>
            </li>
          </ul>
        </div>
      </nav>
      <AuthModal open={isOpen} onClose={handleCloseModal} defaultMode={mode} setMode={setMode} />
    </>
  );
};

export default TopNavbar;


