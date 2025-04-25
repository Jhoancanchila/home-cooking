import { FC, useEffect, useState } from "react";
import { Link } from "react-scroll";
import { Link as LinkNavigate, useLocation, useNavigate } from "react-router-dom";
// Components
import Sidebar from "./Sidebar";
import Backdrop from "../Elements/Backdrop";
// Assets
import LogoIcon from "../../../assets/svg/Logo.jsx";
import BurgerIcon from "../../../assets/svg/BurgerIcon.jsx";
import { useHandleModal } from "../../hooks/useHandleModal.js";
import AuthModal from "../Modals/AuthModal.js";
import { useAuth } from "../../../context/AuthContext.js";

// Breakpoint para dispositivos móviles (768px para md en Tailwind por defecto)
const MOBILE_BREAKPOINT = 768;

const TopNavbar: FC = () => {
  const { isOpen, handleOpenModal, handleCloseModal, mode, setMode } = useHandleModal();
  const [y, setY] = useState<number>(window.scrollY);
  const [sidebarOpen, toggleSidebar] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user, userData } = useAuth();
  
  const isLanding = location.pathname === '/';

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

  // Cerrar el menú desplegable al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (dropdownOpen && !target.closest('#user-menu-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setDropdownOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Redireccionar a my-services si el usuario está autenticado y está en una ruta que no es my-services
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/my-services');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Estilos para los ítems del menú
  const navLinkClasses = "px-[8px] lg:px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF] font-semibold";
  
  // Estilos para los ítems seleccionados
  const navLinkActiveClasses = "text-[#7620FF] border-b-2 border-[#7620FF]";

  // Función para obtener la primera letra del nombre del usuario
  const getUserInitial = (): string => {
    // Primero verificar si tenemos userData (datos de nuestra base de datos)
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    
    // Si no tenemos userData, intentar con los datos de Supabase
    if (!user) return "U";
    
    // Intentar obtener el nombre desde los metadatos del usuario
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    
    if (fullName && typeof fullName === 'string' && fullName.length > 0) {
      return fullName.charAt(0).toUpperCase();
    }
    
    // Si no hay nombre disponible, usar la primera letra del email
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    // Si todo falla, mostrar "U" (Usuario)
    return "U";
  };

  // Función para generar el avatar con la inicial del usuario
  const generateInitialsAvatar = () => {
    const initial = getUserInitial();
    return (
      <div className="w-10 h-10 rounded-full bg-[#3d5af1] flex items-center justify-center text-white font-bold text-lg">
        {initial}
      </div>
    );
  };

  // Función para obtener el nombre de visualización del usuario
  const getDisplayName = (): string => {
    // Primero verificar en userData (nuestra base de datos)
    if (userData?.name) {
      return userData.name;
    }
    
    // Si no, intentar con los metadatos de Supabase
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // Si no hay nombre, usar el email o un valor por defecto
    return user?.email || 'Usuario';
  };

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
          {isLanding ? (
            <Link className="cursor-pointer flex items-center shrink-0" to="home" smooth={true}>
              <LogoIcon />
              <h1 className="ml-[15px] text-xl font-extrabold">
                HomeCooKing
              </h1>
            </Link>
          ) : (
            <LinkNavigate to="/" className="cursor-pointer flex items-center shrink-0">
              <LogoIcon />
              <h1 className="ml-[15px] text-xl font-extrabold">
                HomeCooKing
              </h1>
            </LinkNavigate>
          )}
          
          <button 
            className="outline-none border-0 bg-transparent h-full px-[15px] block md:hidden cursor-pointer"
            onClick={() => toggleSidebar(!sidebarOpen)}
          >
            <BurgerIcon />
          </button>
          
          {isLanding && (
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
            </ul>
          )}
          
          <ul className="hidden md:flex items-center gap-2 shrink-0">
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              <li id="user-menu-container" className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                  aria-label="Menú de usuario"
                >
                  {generateInitialsAvatar()}
                </button>
                
                {/* Menú desplegable */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <div className="flex items-center px-4 py-3 border-b border-gray-100">
                      {generateInitialsAvatar()}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <LinkNavigate 
                      to="/my-account" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="mr-2">👤</span>
                      Mi cuenta
                    </LinkNavigate>
                    <LinkNavigate 
                      to="/change-password" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="mr-2">🔑</span>
                      Cambiar contraseña
                    </LinkNavigate>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span className="mr-2">🚪</span>
                      Salir
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </nav>
      <AuthModal open={isOpen} onClose={handleCloseModal} defaultMode={mode} setMode={setMode} />
    </>
  );
};

export default TopNavbar;


