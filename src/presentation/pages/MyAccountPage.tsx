import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/Navbar/TopNavbar';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';

const MyAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData, getUserProfile, updateUserProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({
    text: '',
    type: null
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  // Cargar datos del usuario cuando esté disponible
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && !userData) {
        setStatusMessage({
          text: 'Cargando información de usuario...',
          type: 'info'
        });
        
        const { success, error } = await getUserProfile();
        
        if (!success) {
          setStatusMessage({
            text: `Error al cargar datos: ${error}`,
            type: 'error'
          });
        } else {
          setStatusMessage({
            text: '',
            type: null
          });
        }
      }
    };
    
    loadUserData();
  }, [isAuthenticated, userData, getUserProfile]);

  // Actualizar el formulario cuando se carguen los datos del usuario
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };

  // Enviar el formulario para actualizar datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      setStatusMessage({
        text: 'No hay cambios para guardar',
        type: 'info'
      });
      return;
    }
    
    setIsSubmitting(true);
    setStatusMessage({
      text: 'Guardando cambios...',
      type: 'info'
    });
    
    try {
      const { success, error } = await updateUserProfile({
        name: formData.name,
        phone: formData.phone
      });
      
      if (success) {
        setStatusMessage({
          text: 'Datos actualizados correctamente',
          type: 'success'
        });
        setHasChanges(false);
      } else {
        setStatusMessage({
          text: `Error al actualizar: ${error}`,
          type: 'error'
        });
      }
    } catch (error) {
      setStatusMessage({
        text: `Error inesperado: ${error instanceof Error ? error.message : 'Desconocido'}`,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse bg-white p-8 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-[#7620ff] border-t-transparent rounded-full animate-spin mr-2"></div>
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Mi Cuenta | HomeCooKing</title>
      </Helmet>
      <TopNavbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow mt-[80px]">
        <div className="max-w-3xl mx-auto">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Mi cuenta</h1>
            <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
          </div>
          
          {/* Panel principal */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Avatar y nombre en la cabecera */}
            <div className="bg-gradient-to-r from-[#7620ff]/90 to-[#3d5af1]/90 px-6 py-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-[#7620ff]">
                    {userData.name?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{userData.name || 'Usuario'}</h2>
                  <p className="text-white/80">{userData.email}</p>
                </div>
              </div>
            </div>
            
            {/* Formulario de edición */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Mensajes de estado */}
              {statusMessage.text && (
                <div className={`mb-6 p-4 rounded-lg ${
                  statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                  statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {statusMessage.text}
                </div>
              )}
              
              {/* Campos del formulario */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7620ff]/50 focus:border-[#7620ff] transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userData.email}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="Tu correo electrónico"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    El correo electrónico no se puede modificar.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7620ff]/50 focus:border-[#7620ff] transition-colors"
                    placeholder="Tu número de teléfono"
                  />
                </div>
                
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting || !hasChanges}
                    className={`w-full py-3 px-4 rounded-lg font-medium ${
                      hasChanges 
                        ? 'bg-[#7620ff] text-white hover:bg-[#6510e6]' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } transition-colors`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Guardando...
                      </span>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full mt-3 py-2 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Información adicional */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seguridad de la cuenta</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/change-password')}
                className="flex items-center text-[#3d5af1] hover:text-[#7620ff] transition-colors"
              >
                <span className="mr-2">🔑</span>
                Cambiar contraseña
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

export default MyAccountPage; 