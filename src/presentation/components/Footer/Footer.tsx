import React from "react";
import LogoIcon from "../../../assets/svg/Logo.jsx";
import { Link } from "react-scroll";
// Definición de las interfaces
interface SocialLinkProps {
  href: string;
  children: React.ReactNode;
}

const Footer: React.FC = () => {
  // Componente para los enlaces sociales
  const SocialLink: React.FC<SocialLinkProps> = ({ href, children }) => {
    return (
      <a 
        href={href}
        className="cursor-pointer p-2 rounded-full bg-gray-900 text-gray-100 hover:bg-gray-700 transition duration-300 mr-4 last:mr-0 flex items-center justify-center w-10 h-10"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  };

  // Componente para los elementos de la lista de enlaces
  const LinkListItem: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return <li className="mt-3">{children}</li>;
  };

  // Componente para los enlaces
  const LinkNavigate: React.FC<{href: string; children: React.ReactNode}> = ({ href, children }) => {
    return (
      <a 
        href={href} 
        className="border-b-2 border-transparent hover:border-gray-700 focus:border-gray-700 pb-1 transition duration-300"
      >
        {children}
      </a>
    );
  };

  return (
    <div className="relative bg-gray-200 text-gray-700 -mb-8 px-4 sm:px-8 py-20 lg:py-24">
      <div className="max-w-screen-xl mx-auto relative z-10 px-2">
        {/* Columnas de enlaces */}
        <div className="flex flex-wrap text-left justify-center sm:justify-start md:justify-between -mt-12">
          {/* Columna 1 */}
          <div className="px-6 sm:px-4 sm:w-1/4 md:w-auto mt-12">
            <h5 className="uppercase font-bold text-left">Main</h5>
            <ul className="mt-6 text-sm font-medium text-left">
              <LinkListItem>
                <LinkNavigate href="#">Blog</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">FAQs</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Support</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">About Us</LinkNavigate>
              </LinkListItem>
            </ul>
          </div>

          {/* Columna 2 */}
          <div className="px-6 sm:px-4 sm:w-1/4 md:w-auto mt-12">
            <h5 className="uppercase font-bold text-left">Product</h5>
            <ul className="mt-6 text-sm font-medium text-left">
              <LinkListItem>
                <LinkNavigate href="#">Log In</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Personal</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Business</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Team</LinkNavigate>
              </LinkListItem>
            </ul>
          </div>

          {/* Columna 3 */}
          <div className="px-6 sm:px-4 sm:w-1/4 md:w-auto mt-12">
            <h5 className="uppercase font-bold text-left">Press</h5>
            <ul className="mt-6 text-sm font-medium text-left">
              <LinkListItem>
                <LinkNavigate href="#">Logos</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Events</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Stories</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Office</LinkNavigate>
              </LinkListItem>
            </ul>
          </div>

          {/* Columna 4 */}
          <div className="px-6 sm:px-4 sm:w-1/4 md:w-auto mt-12">
            <h5 className="uppercase font-bold text-left">Legal</h5>
            <ul className="mt-6 text-sm font-medium text-left">
              <LinkListItem>
                <LinkNavigate href="#">GDPR</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Privacy Policy</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Terms of Service</LinkNavigate>
              </LinkListItem>
              <LinkListItem>
                <LinkNavigate href="#">Disclaimer</LinkNavigate>
              </LinkListItem>
            </ul>
          </div>

          {/* Columna de suscripción */}
          <div className="px-6 sm:px-4 text-left w-full lg:w-auto mt-20 lg:mt-12">
            <div className="max-w-sm mx-auto lg:mx-0">
              <h5 className="uppercase font-bold text-left">Subscribe to our Newsletter</h5>
              <p className="mt-2 lg:mt-6 text-sm font-medium text-gray-600 text-left">
                We deliver high quality blog posts written by professionals weekly. And we promise no spam.
              </p>
              <form method="get" action="#" className="mt-4 lg:mt-6 text-sm sm:flex max-w-xs sm:max-w-none mx-auto sm:mx-0">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="bg-gray-300 px-6 py-3 rounded sm:rounded-r-none border-2 sm:border-r-0 border-gray-400 hover:border-primary-500 focus:outline-none transition duration-300 w-full"
                />
                <button 
                  type="submit"
                  className="mt-4 sm:mt-0 w-full sm:w-auto rounded sm:rounded-l-none px-8 py-3 bg-purple-600 text-white font-bold hover:bg-purple-700 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="my-16 border-b-2 border-gray-300 w-full"></div>

        {/* Pie de página con logo y redes sociales */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <Link className="cursor-pointer flex items-center shrink-0" to="home" smooth={true}>
              <LogoIcon />
              <h5 className="ml-2 text-xl font-black tracking-wider text-gray-800">HomeCooKing</h5>
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm sm:text-base mt-8 md:mt-0 font-medium text-gray-500">
            &copy; 2025 HomeCooKing All Rights Reserved.
          </p>

          {/* Redes sociales */}
          <div className="mt-8 md:mt-0 flex">
            <SocialLink href="https://facebook.com">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
              </svg>
            </SocialLink>
            <SocialLink href="https://twitter.com">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </SocialLink>
            <SocialLink href="https://youtube.com">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
              </svg>
            </SocialLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
