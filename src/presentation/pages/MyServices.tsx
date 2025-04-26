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
          const userServices = await serviceRepository.findServicesByUserEmail(user.email || '');
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

  // Función para formatear el precio basado en el número de personas
  const formatPrice = (persons?: string) => {
    if (!persons) return 'US$ 35 - US$ 50';
    
    if (persons === '2') return 'US$ 35 - US$ 50';
    if (persons === '3-6') return 'US$ 30 - US$ 45';
    if (persons === '7-12') return 'US$ 25 - US$ 40';
    if (persons === '13+') return 'US$ 25 - US$ 40';
    
    return 'US$ 35 - US$ 50';
  };

  // Funciones para determinar el estado y horario del servicio
  const getServiceStatus = () => {
    // Aquí podrías implementar lógica real para determinar el estado
    // De momento, simplemente asignamos "CANCELADA" como demo
    return "CANCELADA";
  };

  const getMealTime = (mealTime?: string) => {
    if (!mealTime) return 'Cena';
    
    if (mealTime === 'almuerzo') return 'Almuerzo';
    if (mealTime === 'onces') return 'Onces';
    if (mealTime === 'cena') return 'Cena';
    
    return 'Cena';
  };

  // Función que devuelve el mensaje de caducidad
  const getExpirationMessage = () => {
    // Aquí podrías implementar lógica real para mostrar mensajes de caducidad
    // De momento, mostramos un mensaje fijo para la demo
    return "La solicitud ha caducado. Caducada el 25/04/2025";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 mt-[80px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis servicios</h1>
          {!isLoading && services.length > 0 && (
            <button 
              onClick={() => navigate('/preferences')}
              className="bg-[#7620FF] hover:bg-[#6010e0] text-white font-medium py-2 px-6 rounded-full flex items-center gap-2 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span className="hidden sm:inline">Nuevo servicio</span>
            </button>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              // Valores simulados para el diseño de demostración
              const serviceType = service.service === 'único' ? 'Servicio único' : 
                                   service.service === 'virtual' ? 'Servicio cocina virtual' : 
                                   'Servicio de recetas';
              const formattedDate = "25 abr 2025";
              const mealType = getMealTime(service.meal_time);
              const status = getServiceStatus();
              const expirationMessage = getExpirationMessage();
              const price = formatPrice(service.persons);
              
              return (
                <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow border border-gray-100">
                  {/* Cabecera con estado y título */}
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-semibold text-red-500 mb-2">
                        {status}
                      </div>
                      <div className="flex space-x-2">
                        {/* Botón de editar */}
                        <button 
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Editar servicio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        {/* Botón de eliminar */}
                        <button 
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Eliminar servicio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {serviceType}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {formattedDate} · {mealType} · {price}
                    </p>
                    
                    {/* Detalles del servicio */}
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Personas</span>
                        <span className="font-medium text-gray-800">{service.persons || '2 personas'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Menú</span>
                        <span className="font-medium text-gray-800">{service.cuisine || 'Local'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ocasión</span>
                        <span className="font-medium text-gray-800">{service.occasion || 'Cumpleaños'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lugar</span>
                        <span className="font-medium text-gray-800">{service.location || 'No especificado'}</span>
                      </div>
                      
                      {/* Campo adicional para propuestas */}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Propuestas</span>
                        <span className="font-medium text-gray-800">Tienes 3 propuestas</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mensaje de caducidad en una sección separada */}
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-sm text-gray-600">
                      {expirationMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices; 