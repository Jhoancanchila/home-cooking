import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/Navbar/TopNavbar';
import { Helmet } from 'react-helmet';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Helmet>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fadeIn 0.8s ease-out forwards;
            }
            .delay-100 {
              animation-delay: 0.1s;
            }
            .delay-200 {
              animation-delay: 0.2s;
            }
            .delay-300 {
              animation-delay: 0.3s;
            }
          `}
        </style>
      </Helmet>
      <TopNavbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 mt-[80px]">
        <div className="max-w-2xl w-full">
          <div className="flex flex-col items-center text-center">
            {/* Número 404 con efecto flotante */}
            <div className="animate-float mb-8">
              <div className="relative">
                <div className="text-[120px] md:text-[180px] font-extrabold text-[#3d5af1] opacity-90 leading-none">
                  404
                </div>
                <div className="absolute inset-0 text-[120px] md:text-[180px] font-extrabold text-[#7620ff] opacity-10 blur-lg leading-none">
                  404
                </div>
              </div>
            </div>
            
            {/* Mensaje principal */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
              Página no encontrada
            </h1>
            
            {/* Descripción */}
            <p className="text-lg text-gray-600 max-w-md mb-10 animate-fade-in delay-100">
              Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
            </p>
            
            {/* Línea decorativa */}
            <div className="w-16 h-1 bg-gradient-to-r from-[#3d5af1] to-[#7620ff] rounded-full mb-10 animate-fade-in delay-200"></div>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 rounded-lg border-2 border-[#3d5af1] text-[#3d5af1] font-medium hover:bg-[#3d5af1] hover:text-white transition-colors duration-300"
              >
                Volver atrás
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-lg bg-[#7620ff] text-white font-medium hover:bg-[#6510e6] transition-colors duration-300"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>© {new Date().getFullYear()} HomeCooKing. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default NotFoundPage; 