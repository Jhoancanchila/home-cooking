import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TopNavbar from '../components/Navbar/TopNavbar';
import { Service } from '../../core/entities/Service';
import { SupabaseServiceRepository } from '../../adapters/api/SupabaseServiceRepository';

const serviceRepository = new SupabaseServiceRepository();

const MyServices: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchUserServices = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const userServices = await serviceRepository.findServicesByUserId(user.id);
          setServices(userServices);
        } catch (error) {
          console.error('Error al obtener los servicios:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserServices();
    }
  }, [isAuthenticated, user]);

  // Función para formatear la fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return dateString;
  };

  // Función para formatear el precio
  const formatPrice = (persons?: string) => {
    if (!persons) return 'USD 35 - USD 50';
    
    if (persons === '2') return 'USD 35 - USD 50';
    if (persons === '3-6') return 'USD 30 - USD 45';
    if (persons === '7-12') return 'USD 25 - USD 40';
    if (persons === '13+') return 'USD 25 - USD 40';
    
    return 'USD 35 - USD 50';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 mt-[80px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis servicios</h1>
          <button 
            onClick={() => navigate('/preferences')}
            className="bg-[#7620FF] hover:bg-[#6010e0] text-white font-medium py-2 px-6 rounded-full flex items-center gap-2 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span className="inline"> servicio</span>
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">No tienes servicios activos</h2>
            <p className="text-gray-500 mb-6">
              Parece que aún no has contratado ningún servicio. ¡Empieza a explorar nuestras opciones!
            </p>
            <button 
              onClick={() => navigate('/preferences')}
              className="bg-[#7620FF] hover:bg-[#6010e0] text-white font-semibold py-3 px-8 rounded-full transition duration-300"
            >
              Contratar un servicio
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-amber-600 mb-2">
                      EN PROCESO
                    </div>
                    <h2 className="text-xl font-bold">
                      {service.service === 'único' ? 'Servicio único' : 
                       service.service === 'virtual' ? 'Servicio cocina virtual' : 
                       'Servicio de recetas'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {formatDate(service.event_date)} · {formatPrice(service.persons)}
                    </p>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Eliminar servicio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Personas</p>
                    <p className="font-medium">{service.persons || '2 personas'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Menú</p>
                    <p className="font-medium">{service.cuisine || 'Local'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ocasión</p>
                    <p className="font-medium">{service.occasion || 'Cumpleaños'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lugar</p>
                    <p className="font-medium">{service.location || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices; 