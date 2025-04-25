import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoIcon from "../../assets/svg/Logo.jsx";
import { UserProfile } from '../../core/entities/User';
import { SaveUserData } from '../../core/use-cases/SaveUserData';
import { SupabaseUserProfileRepository } from '../../adapters/api/SupabaseUserRepository';
import { SaveServiceData } from '../../core/use-cases/SaveServiceData';
import { SupabaseServiceRepository } from '../../adapters/api/SupabaseServiceRepository';
import { Service } from '../../core/entities/Service';

// Inicializar el repositorio y el caso de uso
const userRepository = new SupabaseUserProfileRepository();
const saveUserDataUseCase = new SaveUserData(userRepository);

const serviceRepository = new SupabaseServiceRepository();
const saveServiceDataUseCase = new SaveServiceData(serviceRepository);

// Página de selección de servicios de chef
const ServiceSelection: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPersons, setSelectedPersons] = useState<string | null>(null);
  const [selectedMealTime, setSelectedMealTime] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventDescription, setEventDescription] = useState<string>('');
  
  // Datos de contacto del usuario
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userSource, setUserSource] = useState<string>('');
  
  // Configuración del calendario
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [calendarDays, setCalendarDays] = useState<Array<{day: number, month: number, year: number, isCurrentMonth: boolean, isPast: boolean}>>([]);
  
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  
  // Generar días del calendario
  useEffect(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Ajustar para que la semana empiece en lunes (0 = lunes, 6 = domingo)
    
    const days = [];
    
    // Días del mes anterior
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const month = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
      const year = currentMonth - 1 < 0 ? currentYear - 1 : currentYear;
      const date = new Date(year, month, day);
      const isPast = date <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      days.push({
        day,
        month,
        year,
        isCurrentMonth: false,
        isPast
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date <= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isPast
      });
    }
    
    // Días del mes siguiente para completar filas (no 6 semanas completas para evitar scroll)
    // Calcular cuántos días se necesitan para completar la última semana
    const remainingDays = 7 - (days.length % 7 || 7); // Si days.length es múltiplo de 7, añadir 0 días
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const month = currentMonth + 1 > 11 ? 0 : currentMonth + 1;
        const year = currentMonth + 1 > 11 ? currentYear + 1 : currentYear;
        const date = new Date(year, month, i);
        days.push({
          day: i,
          month,
          year,
          isCurrentMonth: false,
          isPast: date <= new Date(today.getFullYear(), today.getMonth(), today.getDate())
        });
      }
    }
    
    setCalendarDays(days);
  }, [currentMonth, currentYear]);
  
  // Navegar a mes anterior
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navegar a mes siguiente
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Formatear fecha para mostrar
  const formatDate = (day: number, month: number, year: number): string => {
    return `${day} de ${monthNames[month]} de ${year}`;
  };
  
  // Función para avanzar al siguiente paso
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  // Función para seleccionar un servicio
  const handleServiceSelection = (service: string) => {
    setSelectedService(service);
  };

  // Función para seleccionar una ocasión
  const handleOccasionSelection = (occasion: string) => {
    setSelectedOccasion(occasion);
  };

  // Función para actualizar la ubicación - versión simplificada
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);
  };

  // Función para seleccionar número de personas
  const handlePersonsSelection = (persons: string) => {
    setSelectedPersons(persons);
  };

  // Función para seleccionar horario de comida
  const handleMealTimeSelection = (mealTime: string) => {
    setSelectedMealTime(mealTime);
  };

  // Función para seleccionar tipo de cocina
  const handleCuisineSelection = (cuisine: string) => {
    setSelectedCuisine(cuisine);
  };

  // Función para seleccionar fecha
  const handleDateSelection = (day: number, month: number, year: number) => {
    setSelectedDate(formatDate(day, month, year));
  };

  // Función para actualizar la descripción del evento
  const handleEventDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEventDescription(e.target.value);
  };
  
  // Funciones para actualizar los datos de contacto
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  
  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  };
  
  const handleUserPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhone(e.target.value);
  };
  
  const handleUserSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserSource(e.target.value);
  };

  // Comprobar si se puede continuar en el paso actual
  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedOccasion !== null;
      case 3:
        return selectedLocation.trim() !== '';
      case 4:
        return selectedPersons !== null;
      case 5:
        return selectedMealTime !== null;
      case 6:
        return selectedCuisine !== null;
      case 7:
        return selectedDate !== null;
      case 8:
        return true; // Descripción, es opcional
      case 9:
        return true; // Resumen, siempre puede continuar
      case 10:
        // Validar campos obligatorios de contacto
        return userName.trim() !== '' && 
               userEmail.trim() !== '' && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail) && 
               userPhone.trim() !== '';
      default:
        return false;
    }
  };

  // Función para manejar la finalización del proceso
  const handleFinish = async () => {
    if (!canContinue()) return;
    
    // Preparar los datos del usuario para guardar
    const userData: UserProfile = {
      name: userName,
      email: userEmail,
      phone: userPhone,
      source: userSource || undefined,
    };
    
    try {
      // Mostrar estado de carga
      setIsSubmitting(true);
      
      // Guardar datos del usuario usando el caso de uso
      const userResult = await saveUserDataUseCase.execute(userData);
      
      if (!userResult.success || !userResult.data) {
        setSubmissionError(userResult.error || 'Ha ocurrido un error al guardar tus datos. Por favor, intenta nuevamente.');
        console.error('Error al guardar datos del usuario:', userResult.error);
        return;
      }
      
      // Obtenemos el ID del usuario creado
      const userId = userResult.data.id;
      
      // Verificar que el userId exista
      if (!userId) {
        setSubmissionError('Error al obtener el ID del usuario. Por favor, intenta nuevamente.');
        return;
      }
      
      // Preparar los datos del servicio para guardar
      const serviceData: Service = {
        user_id: userId,
        service: selectedService || undefined,
        occasion: selectedOccasion || undefined,
        location: selectedLocation || undefined,
        persons: selectedPersons || undefined,
        meal_time: selectedMealTime || undefined,
        cuisine: selectedCuisine || undefined,
        event_date: selectedDate || undefined,
        description: eventDescription || undefined,
      };
      
      // Guardar datos del servicio
      const serviceResult = await saveServiceDataUseCase.execute(serviceData);
      
      if (!serviceResult.success) {
        setSubmissionError('Ha ocurrido un error al guardar los datos del servicio. Por favor, intenta nuevamente.');
        console.error('Error al guardar datos del servicio:', serviceResult.error);
        return;
      }
      
      // Redirigir a página de éxito
      navigate('/success');
    } catch (err) {
      console.error('Error en el proceso:', err);
      setSubmissionError('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Estados para el manejo del envío de datos
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Renderizar el contenido del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Qué tipo de servicio de cocina necesitas?
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Define tu evento para ver , menús y precios. ¡Te llevará menos de 2 minutos!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedService === 'único' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection('único')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v8"/>
                      <path d="M17.2 5.2a10 10 0 0 1 0 14.1"/>
                      <path d="M6.8 5.2a10 10 0 0 0 0 14.1"/>
                      <path d="M3 10h7"/>
                      <path d="M14 10h7"/>
                      <path d="M16 19h2"/>
                      <path d="M6 19h2"/>
                      <path d="M10 19h4"/>
                    </svg>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedService === 'único' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Servicio único</h3>
                <p className="text-gray-600">Una experiencia inolvidable.</p>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedService === 'virtual' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection('virtual')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedService === 'virtual' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Servicio cocina virtual</h3>
                <p className="text-gray-600">Aprende a cocinar en directo.</p>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedService === 'receta' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection('receta')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M14 2v6h6"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedService === 'receta' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold">Servicio de recetas</h3>
                <p className="text-gray-600">Recetas personalizadas.</p>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Cuál es la ocasión?
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Esto nos ayuda a transmitir el ambiente ideal del evento.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedOccasion === 'cumpleaños' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('cumpleaños')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"></path>
                      <path d="M8 10V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3"></path>
                      <path d="M7 15v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1"></path>
                      <path d="M7 21v-1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1"></path>
                      <path d="M11 10V6"></path>
                      <path d="M14 10V6"></path>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Cumpleaños</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'cumpleaños' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedOccasion === 'reunion-familiar' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('reunion-familiar')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Reunión familiar</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'reunion-familiar' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedOccasion === 'amigos' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('amigos')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="7" r="4"></circle>
                      <path d="M5 22v-5a7 7 0 0 1 14 0v5"></path>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Reunión con amigos</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'amigos' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedOccasion === 'otra' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOccasionSelection('otra')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4"></path>
                      <path d="M12 16h.01"></path>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Otra</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedOccasion === 'otra' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Dónde será el evento?
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Ingresa la dirección o ciudad donde se prestará el servicio
            </p>
            
            <div className="w-full relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full p-4 pl-12 text-lg border border-gray-200 rounded-xl bg-blue-50 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  placeholder="Ej: Carrera 70D #66-42, Bogotá"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  autoComplete="off"
                />
              </div>
              
              {/* Eliminamos la sección de sugerencias y dejamos solo un mensaje informativo */}
              <div className="mt-6 text-center text-gray-500">
                <p className="text-sm">Ingresa la dirección exacta en el formato que prefieras.</p>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Para cuántas personas?
            </h1>
            <p className="text-center text-gray-600 mb-10">
              La tarifa es fija, por lo que el precio varía según el tamaño del grupo.
            </p>
            
            <div className="space-y-4">
              <div 
                className={`border rounded-xl p-5 cursor-pointer transition-all ${
                  selectedPersons === '2' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePersonsSelection('2')}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    <span className="font-semibold">2 personas</span> desde US$ 35
                  </div>
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
                  <div className="font-medium">
                    <span className="font-semibold">3 a 6 personas</span> desde US$ 30
                  </div>
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
                  <div className="font-medium">
                    <span className="font-semibold">7 a 12 personas</span> desde US$ 25
                  </div>
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
                  <div className="font-medium">
                    <span className="font-semibold">13+ personas</span> desde US$ 25
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedPersons === '13+' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
              <p className="text-gray-700">
                ¿No estás seguro? Puedes cambiarlo más adelante! 😉
              </p>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿A qué hora?
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Selecciona el horario para tu servicio
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedMealTime === 'almuerzo' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTimeSelection('almuerzo')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9"></circle>
                      <path d="M12 8v4"></path>
                      <path d="M12 12l3 2"></path>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Almuerzo</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedMealTime === 'almuerzo' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedMealTime === 'onces' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTimeSelection('onces')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                      <line x1="6" y1="1" x2="6" y2="4"></line>
                      <line x1="10" y1="1" x2="10" y2="4"></line>
                      <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Onces</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedMealTime === 'onces' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedMealTime === 'comida' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMealTimeSelection('comida')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Comida</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedMealTime === 'comida' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Qué te apetece?
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Selecciona la opción que más te guste para tu evento
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedCuisine === 'sopas' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('sopas')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 10h18c-.4 4.8-3.5 9-8 10a9.1 9.1 0 0 1-8-10v0Z" />
                      <path d="M12 3v2" />
                      <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
                      <path d="M4 19h16" />
                    </svg>
                    <span className="ml-4 text-lg font-medium">Sopas</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'sopas' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedCuisine === 'mariscos' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('mariscos')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
                      <path d="M18 12v.5"/>
                      <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/>
                      <path d="M7.99 5.99c-1.58 2.55-1.58 9.47 0 12.02"/>
                      <path d="M10 10h.01"/>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Mariscos/Pescados</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'mariscos' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedCuisine === 'arroces' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('arroces')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 22h18" />
                      <path d="M18 20H6a4 4 0 0 1-4-4V5c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2v1h12V5a2 2 0 0 1 2-2h0c1.1 0 2 .9 2 2v11a4 4 0 0 1-4 4Z" />
                    </svg>
                    <span className="ml-4 text-lg font-medium">Arroces Especiales</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'arroces' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedCuisine === 'pasabocas' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('pasabocas')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 8h18a2 2 0 0 1 2 2v2c0 3.3-2.7 6-6 6H6a6 6 0 0 1-6-6v-2a2 2 0 0 1 2-2z"/>
                      <path d="M4 8c0-1.5.8-2 2-2h10a2 2 0 0 1 2 2"/>
                      <path d="M8 2v4"/>
                      <path d="M14 2v4"/>
                      <path d="M10 8v4"/>
                      <path d="M7 15c3 0 5-1 5-1"/>
                      <path d="M12 5c1-.5 2-1 4-1"/>
                    </svg>
                    <span className="ml-4 text-lg font-medium">Pasabocas</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'pasabocas' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>

              <div 
                className={`border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedCuisine === 'otros' 
                    ? 'border-purple-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleCuisineSelection('otros')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <span className="ml-4 text-lg font-medium">Otros</span>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 flex items-center justify-center">
                    {selectedCuisine === 'otros' && (
                      <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 7:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¿Cuándo?
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Selecciona la fecha para tu servicio
            </p>
            
            <div className="border rounded-xl overflow-hidden bg-white shadow-md">
              {/* Cabecera del calendario */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 flex justify-between items-center">
                <button 
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200"
                  onClick={handlePrevMonth}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <div className="text-lg font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </div>
                <button 
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200"
                  onClick={handleNextMonth}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              
              {/* Días de la semana */}
              <div className="bg-gray-50 grid grid-cols-7 border-b">
                {dayNames.map(day => (
                  <div key={day} className="text-center py-1.5 text-xs font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Días del mes */}
              <div className="grid grid-cols-7 p-2 gap-0.5">
                {calendarDays.map((dayInfo, idx) => (
                  <button 
                    key={idx} 
                    className={`
                      h-9 w-full rounded-md flex items-center justify-center text-xs 
                      ${!dayInfo.isCurrentMonth ? 'text-gray-400' : 'font-medium'} 
                      ${dayInfo.isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-100 transition-colors duration-200'}
                      ${selectedDate === formatDate(dayInfo.day, dayInfo.month, dayInfo.year) 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-white'}
                      ${dayInfo.day === today.getDate() && dayInfo.month === today.getMonth() && dayInfo.year === today.getFullYear() && dayInfo.isCurrentMonth
                        ? 'ring-1 ring-purple-500 opacity-50 cursor-not-allowed' 
                        : ''}
                    `}
                    onClick={() => {
                      if (!dayInfo.isPast) {
                        // Verificar que no sea el día actual
                        const isToday = dayInfo.day === today.getDate() && 
                                       dayInfo.month === today.getMonth() && 
                                       dayInfo.year === today.getFullYear() &&
                                       dayInfo.isCurrentMonth;
                        if (!isToday) {
                          handleDateSelection(dayInfo.day, dayInfo.month, dayInfo.year);
                        }
                      }
                    }}
                    disabled={dayInfo.isPast || (dayInfo.day === today.getDate() && dayInfo.month === today.getMonth() && dayInfo.year === today.getFullYear() && dayInfo.isCurrentMonth)}
                  >
                    {dayInfo.day}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Fecha seleccionada */}
            {selectedDate && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100 text-center">
                <p className="text-base font-medium text-purple-700">
                  Fecha seleccionada: {selectedDate}
                </p>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-center">
              <p className="text-sm text-gray-700">
                ¿No estás seguro? Puedes cambiarlo más adelante! 😉
              </p>
            </div>
          </div>
        );
      
      case 8:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Por último, describe tu evento a nuestros chefs
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Comparte detalles sobre la ocasión, el ambiente, el menú ideal y cualquier
              otra información clave para que puedan hacerlo perfecto.
            </p>
            
            <div className="w-full">
              <textarea
                className="w-full p-4 min-h-[180px] text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none"
                placeholder="Hola chef! Nos gustaría que el menú tuviera dos entrantes, principal y postre. ¡Gracias!"
                value={eventDescription}
                onChange={handleEventDescriptionChange}
              ></textarea>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 text-center">
              <p className="text-sm text-gray-700">
                Compartir estos detalles ayudará a los chefs a preparar la mejor experiencia para ti
              </p>
            </div>
          </div>
        );
      
      case 9:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Resumen de tu selección
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Revisa tus preferencias antes de continuar
            </p>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Tipo de servicio:</p>
                  <p className="text-gray-700">
                    {selectedService === 'único' 
                      ? 'Servicio único' 
                      : selectedService === 'virtual' 
                        ? 'Servicio cocina virtual' 
                        : 'Servicio receta'}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Ocasión:</p>
                  <p className="text-gray-700">
                    {selectedOccasion === 'cumpleaños' && 'Cumpleaños'}
                    {selectedOccasion === 'reunion-familiar' && 'Reunión familiar'}
                    {selectedOccasion === 'despedida' && 'Despedida de soltero/a'}
                    {selectedOccasion === 'amigos' && 'Reunión con amigos'}
                    {selectedOccasion === 'romantica' && 'Cena romántica'}
                    {selectedOccasion === 'corporativo' && 'Evento corporativo'}
                    {selectedOccasion === 'aventura' && 'Aventura gastronómica'}
                    {selectedOccasion === 'otra' && 'Otra'}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Ubicación:</p>
                  <p className="text-gray-700">{selectedLocation}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Número de personas:</p>
                  <p className="text-gray-700">
                    {selectedPersons === '2' && '2 personas'}
                    {selectedPersons === '3-6' && '3 a 6 personas'}
                    {selectedPersons === '7-12' && '7 a 12 personas'}
                    {selectedPersons === '13+' && '13+ personas'}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Horario:</p>
                  <p className="text-gray-700">
                    {selectedMealTime === 'almuerzo' ? 'Almuerzo' : 
                     selectedMealTime === 'onces' ? 'Onces' : 'Comida'}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Tipo de cocina:</p>
                  <p className="text-gray-700">
                    {selectedCuisine === 'sopas' && 'Sopas'}
                    {selectedCuisine === 'mariscos' && 'Mariscos/Pescados'}
                    {selectedCuisine === 'arroces' && 'Arroces Especiales'}
                    {selectedCuisine === 'pasabocas' && 'Pasabocas'}
                    {selectedCuisine === 'otros' && 'Otros'}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <p className="font-bold">Fecha:</p>
                  <p className="text-gray-700">
                    {selectedDate || 'No seleccionada'}
                  </p>
                </div>
                {eventDescription && (
                  <div className="flex flex-col">
                    <p className="font-bold mb-2">Descripción del evento:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {eventDescription.length > 100 
                        ? `${eventDescription.substring(0, 100)}...` 
                        : eventDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <p className="text-green-600 font-medium">¡Genial! Ahora ya tenemos tus preferencias, esto nos permitirá brindarte un buen servicio.</p>
            </div>
          </div>
        );
      
      case 10:
        return (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              ¡Ya está!
            </h1>
            <p className="text-center text-gray-600 mb-10">
              Ahora, sólo tienes que añadir tus datos de contacto y te enviaremos 
              propuestas de menú personalizadas y gratuitas en menos de 20 minutos.
            </p>
            
            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block font-medium mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  placeholder="John Doe"
                  value={userName}
                  onChange={handleUserNameChange}
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  placeholder="example@mail.com"
                  value={userEmail}
                  onChange={handleUserEmailChange}
                  required
                />
              </div>
              
              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block font-medium mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="flex items-center justify-center px-4 border border-r-0 border-gray-200 rounded-l-xl bg-gray-50">
                    <div className="flex items-center gap-2">
                      <img src="https://flagcdn.com/w20/co.png" alt="Bandera de Colombia" className="w-6 h-4" />
                      <span className="font-medium">+57</span>
                    </div>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-4 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                    placeholder="000-000-000"
                    value={userPhone}
                    onChange={handleUserPhoneChange}
                    required
                  />
                </div>
              </div>
              
              {/* Cómo nos conociste */}
              <div>
                <label htmlFor="source" className="block font-medium mb-2">
                  ¿Cómo nos conociste?
                </label>
                <select
                  id="source"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent appearance-none bg-white"
                  value={userSource}
                  onChange={handleUserSourceChange}
                >
                  <option value="" disabled>Indique una opción</option>
                  <option value="amigos">Por amigos</option>
                  <option value="redes">Redes sociales</option>
                  <option value="busqueda">Búsqueda en internet</option>
                  <option value="publicidad">Publicidad</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              {/* Términos y políticas */}
              <div className="text-sm text-gray-600 mt-6">
                <p>
                  Al enviar este formulario, aceptas nuestros <a href="#" className="text-purple-600 font-medium">Términos</a> y reconoces la <a href="#" className="text-purple-600 font-medium">Declaración de privacidad global</a>.
                </p>
                <p className="mt-4">
                  Este sitio está protegido por reCAPTCHA y se aplican la <a href="#" className="text-purple-600 font-medium">Política de privacidad</a> y <a href="#" className="text-purple-600 font-medium">Términos de servicio</a> de Google.
                </p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header - Fijo en la parte superior */}
      <header className="relative bg-white z-10 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div className="text-xl font-bold flex items-center gap-2">
            <LogoIcon />
            HomeCooKing
          </div>
          
          <div className="hidden md:flex gap-4 items-center text-gray-700">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#7620FF] flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm">PRESUPUESTOS EN 20 MIN</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-[#7620FF] flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm">SIN COMPROMISO</span>
            </div>
          </div>
          
          <button onClick={() => navigate('/')} className="text-2xl">&times;</button>
        </div>
        
        {/* Barra de progreso en lugar del border-bottom */}
        <div className="h-[1px] w-full bg-gray-200 relative">
          <div 
            className="h-[3px] absolute bottom-0 left-0 bg-[#7620FF] transition-all duration-300 ease-in-out" 
            style={{ 
              width: currentStep === 1 ? '0%' : `${((currentStep - 1) / 9) * 100}%`
            }}
          ></div>
        </div>
      </header>
      
      {/* Main content - Área desplazable */}
      <main className="flex-1 py-12 px-6 overflow-y-auto">
        {renderStepContent()}
      </main>
      
      {/* Footer - Fijo en la parte inferior */}
      <footer className="border-t border-gray-200 py-4 px-6 bg-white z-10 sticky bottom-0">
        <div className="max-w-7xl mx-auto flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-8 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50"
            >
              Volver
            </button>
          )}
          
          <div className="ml-auto">
            {currentStep === 10 ? (
              <button
                onClick={handleFinish}
                disabled={!canContinue() || isSubmitting}
                className={`px-8 py-3 rounded-full font-medium flex items-center ${
                  !canContinue() || isSubmitting
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
                    Enviando...
                  </>
                ) : (
                  'Finalizar'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className={`px-8 py-3 rounded-full font-medium ${
                  !canContinue()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#7620FF] text-white hover:bg-purple-700'
                }`}
              >
                Continuar
              </button>
            )}
          </div>
        </div>
        
        {/* Mostrar mensaje de error si existe */}
        {submissionError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-center text-sm max-w-3xl mx-auto">
            {submissionError}
          </div>
        )}
      </footer>
    </div>
  );
};

export default ServiceSelection; 