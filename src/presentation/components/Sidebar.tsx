import { FC } from 'react';
import { Link } from "react-scroll";
import { Link as LinkNavigate, useNavigate } from "react-router-dom";
// Assets
import CloseIcon from "../../../assets/svg/CloseIcon.jsx";
import LogoIcon from "../../../assets/svg/Logo.jsx";
import { useAuth } from '../../context/AuthContext.js';


interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: (isOpen: boolean) => void;
  toggleModal: (mode: "login" | "signup") => void;
}

const Sidebar: FC<SidebarProps> = ({ sidebarOpen, toggleSidebar, toggleModal }) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const isLanding = true; // Valor predeterminado
  
  // Estilos para los ítems del menú
  const navLinkClasses = "text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]";
  
  // Estilos para los ítems seleccionados
  const navLinkActiveClasses = "text-[#7620FF] border-b-2 border-[#7620FF]";
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toggleSidebar(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>      
      <nav className={`fixed top-0 h-[100vh] w-[400px] bg-[#0B093B] py-0 px-[30px] transition-all duration-300 z-50 ${sidebarOpen ? "right-0" : "right-[-400px]"} md:max-w-full`}>
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center">
            <LogoIcon />
            <h1 className="text-white text-xl ml-[15px]">
              HomeCooKing
            </h1>
          </div>
          <button 
            onClick={() => toggleSidebar(!sidebarOpen)} 
            className="transition-all duration-300 cursor-pointer bg-transparent border-0 outline-none p-[10px]"
          >
            <CloseIcon />
          </button>
        </div>

        {isLanding ? (
          <ul className="flex flex-col items-center py-10">
            <li className="font-semibold text-[15px] cursor-pointer my-5">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass={navLinkActiveClasses}
                className={navLinkClasses}
                to="home"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Home
              </Link>
            </li>
            <li className="font-semibold text-[15px] cursor-pointer my-5">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass={navLinkActiveClasses}
                className={navLinkClasses}
                to="services"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Services
              </Link>
            </li>
            <li className="font-semibold text-[15px] cursor-pointer my-5">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass={navLinkActiveClasses}
                className={navLinkClasses}
                to="menu"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Menú
              </Link>
            </li>
            <li className="font-semibold text-[15px] cursor-pointer my-5">
              <Link
                onClick={() => toggleSidebar(!sidebarOpen)}
                activeClass={navLinkActiveClasses}
                className={navLinkClasses}
                to="testimonials"
                spy={true}
                smooth={true}
                offset={-60}
              >
                Testimonios
              </Link>
            </li>
          </ul>
        ) : (
          <div className="py-10">
            <ul className="flex flex-col items-center">
              {!isLanding && (
                <li className="font-semibold text-[15px] cursor-pointer my-5">
                  <LinkNavigate
                    to="/"
                    onClick={() => toggleSidebar(false)}
                    className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]"
                  >
                    Home
                  </LinkNavigate>
                </li>
              )}
              
              {isAuthenticated && (
                <li className="font-semibold text-[15px] cursor-pointer my-5">
                  <LinkNavigate
                    to="/my-services"
                    onClick={() => toggleSidebar(false)}
                    className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]"
                  >
                    Mis Servicios
                  </LinkNavigate>
                </li>
              )}
            </ul>
          </div>
        )}
        
        <ul className="flex flex-col items-center py-5 border-t border-gray-700">
          {!isAuthenticated ? (
            <>
              <li className="font-semibold text-[15px] cursor-pointer my-3">
                <button 
                  onClick={() => {
                    toggleModal("login");
                    toggleSidebar(false);
                  }} 
                  className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]"
                >
                  Acceder
                </button>
              </li>
              <li className="font-semibold text-[15px] cursor-pointer my-3 flex items-center justify-center">
                <LinkNavigate 
                  to="/preferences" 
                  onClick={() => toggleSidebar(false)}
                  className="rounded-lg bg-[#7620FF] bg-opacity-20 px-[15px] py-[10px] hover:bg-[#7620FF] hover:text-white transition-all duration-300"
                >
                  Comenzar
                </LinkNavigate>
              </li>
            </>
          ) : (
            <>
              <li className="font-semibold text-[15px] cursor-pointer my-3">
                <LinkNavigate 
                  to="/my-account" 
                  onClick={() => toggleSidebar(false)}
                  className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]"
                >
                  Mi cuenta
                </LinkNavigate>
              </li>
              <li className="font-semibold text-[15px] cursor-pointer my-3">
                <LinkNavigate 
                  to="/change-password" 
                  onClick={() => toggleSidebar(false)}
                  className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]"
                >
                  Cambiar contraseña
                </LinkNavigate>
              </li>
              <li className="font-semibold text-[15px] cursor-pointer my-3">
                <button 
                  onClick={handleLogout}
                  className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar; 