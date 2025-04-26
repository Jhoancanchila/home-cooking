import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavbar from '../components/Navbar/TopNavbar';
import { useAuth } from '../../context/AuthContext';
import { Service } from '../../core/entities/Service';
import { SupabaseServiceRepository } from '../../adapters/api/SupabaseServiceRepository';
import { UpdateServiceData } from '../../core/use-cases/UpdateServiceData';

// Inicializar el repositorio y el caso de uso
const serviceRepository = new SupabaseServiceRepository();
const updateServiceDataUseCase = new UpdateServiceData(serviceRepository);

const EditService: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  
  // Estado para almacenar los datos del servicio
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Estados para los campos editables
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPersons, setSelectedPersons] = useState<string | undefined>(undefined);
  const [selectedMealTime, setSelectedMealTime] = useState<string | undefined>(undefined);
  const [selectedCuisine, setSelectedCuisine] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [eventDescription, setEventDescription] = useState<string>('');

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Cargar los datos del servicio al inicio
  useEffect(() => {
    const fetchServiceData = async () => {
      if (!serviceId) {
        setError('ID de servicio no proporcionado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await serviceRepository.getServiceById(serviceId);
        
        if (error) {
          setError('Error al cargar el servicio: ' + error.message);
          return;
        }

        if (!data) {
          setError('No se encontró el servicio solicitado');
          return;
        }

        // Almacenar el servicio completo
        setService(data);
        
        // Inicializar los estados con los valores del servicio
        setSelectedService(data.service);
        setSelectedOccasion(data.occasion);
        setSelectedLocation(data.location || '');
        setSelectedPersons(data.persons);
        setSelectedMealTime(data.meal_time);
        setSelectedCuisine(data.cuisine);
        setSelectedDate(data.event_date);
        setEventDescription(data.description || '');
      } catch (err) {
        setError('Error inesperado al cargar el servicio');
        console.error('Error al cargar el servicio:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && serviceId) {
      fetchServiceData();
    }
  }, [serviceId, isAuthenticated]);

  // Handlers para actualizar los campos
  const handleServiceSelection = (service: string) => {
    setSelectedService(service);
  };

  const handleOccasionSelection = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handlePersonsSelection = (persons: string) => {
    setSelectedPersons(persons);
  };

  const handleMealTimeSelection = (mealTime: string) => {
    setSelectedMealTime(mealTime);
  };

  const handleCuisineSelection = (cuisine: string) => {
    setSelectedCuisine(cuisine);
  };

  const handleEventDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEventDescription(e.target.value);
  };

  // Función para manejar la actualización del servicio
  const handleUpdateService = async () => {
    if (!serviceId || !service) {
      setError('No se puede actualizar: información de servicio incompleta');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      
      // Preparar los datos del servicio para actualizar
      const serviceData: Partial<Service> = {
        service: selectedService,
        occasion: selectedOccasion,
        location: selectedLocation || undefined,
        persons: selectedPersons,
        meal_time: selectedMealTime,
        cuisine: selectedCuisine,
        event_date: selectedDate,
        description: eventDescription || undefined,
      };
      
      // Actualizar datos del servicio
      const result = await updateServiceDataUseCase.execute(serviceId, serviceData);
      
      if (!result.success) {
        setError(result.error || 'Error al actualizar el servicio');
        return;
      }
      
      setSuccessMessage('Servicio actualizado correctamente');
      
      // Redirigir después de un breve tiempo
      setTimeout(() => {
        navigate('/my-services');
      }, 2000);
    } catch (err) {
      setError('Error inesperado al actualizar el servicio');
      console.error('Error en el proceso de actualización:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para verificar si se puede guardar
  const canSave = () => {
    return (
      selectedService !== undefined &&
      selectedOccasion !== undefined &&
      selectedLocation.trim() !== '' &&
      selectedPersons !== undefined &&
      selectedMealTime !== undefined &&
      selectedCuisine !== undefined &&
      selectedDate !== undefined
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNavbar />
        <div className="flex-1 flex justify-center items-center mt-[80px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopNavbar />
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 mt-[80px]">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/my-services')}
              className="mt-4 bg-[#7620FF] hover:bg-[#6010e0] text-white font-medium py-2 px-6 rounded-full transition duration-300"
            >
              Volver a mis servicios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 mt-[80px]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Editar servicio</h1>
          <p className="text-gray-600 mt-2">Actualiza los detalles de tu servicio</p>
        </div>
        
        {/* Mensajes de error o éxito */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-600">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-600">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Tipo de servicio */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tipo de servicio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedService === 'único' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection('único')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Servicio único</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedService === 'único' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedService === 'virtual' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection('virtual')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Servicio cocina virtual</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedService === 'virtual' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedService === 'receta' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection('receta')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Servicio receta</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedService === 'receta' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ocasión */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ocasión</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedOccasion === 'cumpleaños' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('cumpleaños')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cumpleaños</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'cumpleaños' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedOccasion === 'amigos' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('amigos')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Reunión con amigos</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'amigos' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedOccasion === 'corporativo' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('corporativo')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Evento corporativo</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'corporativo' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ubicación */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
            <input
              type="text"
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              placeholder="Dirección completa"
              value={selectedLocation}
              onChange={handleLocationChange}
            />
          </div>
          
          {/* Personas */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Número de personas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedPersons === '2' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePersonsSelection('2')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">2 personas</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedPersons === '2' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedPersons === '3-6' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePersonsSelection('3-6')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">3 a 6 personas</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedPersons === '3-6' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedPersons === '7-12' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePersonsSelection('7-12')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">7 a 12 personas</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedPersons === '7-12' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedPersons === '13+' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePersonsSelection('13+')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">13+ personas</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedPersons === '13+' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Horario */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Horario de comida</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedMealTime === 'almuerzo' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTimeSelection('almuerzo')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Almuerzo</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedMealTime === 'almuerzo' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedMealTime === 'onces' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTimeSelection('onces')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Onces</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedMealTime === 'onces' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedMealTime === 'cena' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTimeSelection('cena')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cena</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedMealTime === 'cena' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tipo de cocina */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Tipo de cocina</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedCuisine === 'sopas' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('sopas')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Sopas</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'sopas' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedCuisine === 'mariscos' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('mariscos')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Mariscos/Pescados</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'mariscos' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedCuisine === 'pasabocas' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('pasabocas')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pasabocas</span>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'pasabocas' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Descripción */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Descripción del evento</h2>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent h-32"
              placeholder="Comparte detalles sobre la ocasión, el ambiente, el menú ideal..."
              value={eventDescription}
              onChange={handleEventDescriptionChange}
            ></textarea>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => navigate('/my-services')}
              className="px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleUpdateService}
              disabled={!canSave() || isSubmitting}
              className={`px-8 py-3 rounded-full font-medium flex items-center ${
                !canSave() || isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#7620FF] text-white hover:bg-purple-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService; 