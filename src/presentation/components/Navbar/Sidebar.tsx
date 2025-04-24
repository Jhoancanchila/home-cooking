import { FC } from 'react';
import { Link } from "react-scroll";
import { Link as LinkNavigate } from "react-router-dom";
// Assets
import CloseIcon from "../../../assets/svg/CloseIcon.jsx";
import LogoIcon from "../../../assets/svg/Logo.jsx";

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: (isOpen: boolean) => void;
  toggleModal: (mode: "login" | "signup") => void;
}

const Sidebar: FC<SidebarProps> = ({ sidebarOpen, toggleSidebar, toggleModal }) => {

  // Estilos para los ítems del menú
  const navLinkClasses = "text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]";
  
  // Estilos para los ítems seleccionados
  const navLinkActiveClasses = "text-[#7620FF] border-b-2 border-[#7620FF]";

  return (
    <>      
      <nav className={`fixed top-0 h-[100vh] w-[400px] bg-[#0B093B] py-0 px-[30px] transition-all duration-300 z-50 ${sidebarOpen ? "right-0" : "right-[-400px]"} md:max-w-full`}>
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center">
            <LogoIcon />
            <h1 className="text-white text-xl ml-[15px]">
              SazónGourmet
            </h1>
          </div>
          <button 
            onClick={() => toggleSidebar(!sidebarOpen)} 
            className="transition-all duration-300 cursor-pointer bg-transparent border-0 outline-none p-[10px]"
          >
            <CloseIcon />
          </button>
        </div>

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
        {/*  <li className="font-semibold text-[15px] cursor-pointer my-5">
            <Link
              onClick={() => toggleSidebar(!sidebarOpen)}
              activeClass={navLinkActiveClasses}
              className={navLinkClasses}
              to="pricing"
              spy={true}
              smooth={true}
              offset={-60}
            >
              Pricing
            </Link>
          </li>
          <li className="font-semibold text-[15px] cursor-pointer my-5">
            <Link
              onClick={() => toggleSidebar(!sidebarOpen)}
              activeClass={navLinkActiveClasses}
              className={navLinkClasses}
              to="contact"
              spy={true}
              smooth={true}
              offset={-60}
            >
              Contact
            </Link>
          </li> */}
        </ul>
        <ul className="flex justify-between items-center py-10">
          <li className="font-semibold text-[15px] cursor-pointer">
            <button onClick={() => toggleModal("login")} className="text-white px-[15px] py-[10px] transition-colors duration-300 hover:text-[#7620FF]">
              Acceder
            </button>
          </li>
          <li className="font-semibold text-[15px] cursor-pointer flex items-center justify-center">
            <LinkNavigate to="/preferences" className="rounded-lg bg-[#7620FF] bg-opacity-20 px-[15px] py-[10px] hover:bg-[#7620FF] hover:text-white transition-all duration-300">
              Comenzar
            </LinkNavigate>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
