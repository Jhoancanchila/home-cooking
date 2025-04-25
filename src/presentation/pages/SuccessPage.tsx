import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from "../../assets/svg/Logo.jsx";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white z-10 sticky top-0 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-xl font-bold flex items-center gap-2">
            <LogoIcon />
            HomeCooKing
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center px-4 py-10">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            ¡Gracias por tu solicitud!
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Hemos recibido tus datos correctamente. En breve, uno de nuestros chefs se pondrá en contacto contigo para ofrecerte propuestas personalizadas.
          </p>
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-8">
            <p className="text-purple-800">
              Te hemos enviado un correo de confirmación. Si no lo encuentras, revisa tu carpeta de spam.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/')} 
              className="px-8 py-3 rounded-full font-medium bg-[#7620FF] text-white hover:bg-purple-700 transition-colors duration-300"
            >
              Volver al inicio
            </button>
            
            <button 
              onClick={() => navigate('/menu')} 
              className="px-8 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
            >
              Ver nuestro menú
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2025 HomeCooKing. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default SuccessPage; 