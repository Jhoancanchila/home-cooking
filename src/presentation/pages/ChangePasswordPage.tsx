import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/Navbar/TopNavbar';
import { useAuth } from '../../context/AuthContext';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, updatePassword, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' | null }>({
    text: '',
    type: null
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    checks: {
      length: false,
      letter: false,
      number: false,
      special: false,
    }
  });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Evaluar fortaleza de la contraseña
  useEffect(() => {
    const password = formData.newPassword;
    const checks = {
      length: password.length >= 6,
      letter: /[a-zA-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    setPasswordStrength({ score, checks });
  }, [formData.newPassword]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (statusMessage.text) {
      setStatusMessage({ text: '', type: null });
    }
  };

  // Alternar visibilidad de contraseñas
  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validar formulario
  const validateForm = (): string | null => {
    if (!formData.newPassword.trim()) {
      return 'La nueva contraseña es requerida.';
    }
    
    if (formData.newPassword.length < 6) {
      return 'La nueva contraseña debe tener al menos 6 caracteres.';
    }
    
    if (!passwordStrength.checks.letter || !passwordStrength.checks.number) {
      return 'La contraseña debe contener al menos una letra y un número.';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }
    
    return null;
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setStatusMessage({
        text: validationError,
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    setStatusMessage({
      text: 'Actualizando contraseña...',
      type: 'info'
    });
    
    try {
      console.log("en el try")
      await updatePassword(formData.newPassword);
      
      setStatusMessage({
        text: 'Contraseña actualizada correctamente. Redirigiendo...',
        type: 'success'
      });
      
      // Limpiar formulario
      setFormData({
        newPassword: '',
        confirmPassword: '',
      });
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/my-account');
      }, 2000);
      
    } catch (error) {
      console.error("Error en el catch:", error);
      setStatusMessage({
        text: error instanceof Error ? error.message : 'Error al cambiar la contraseña',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener color y texto del indicador de fortaleza
  const getStrengthInfo = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return { color: 'bg-red-500', text: 'Muy débil', textColor: 'text-red-600' };
      case 2:
        return { color: 'bg-orange-500', text: 'Débil', textColor: 'text-orange-600' };
      case 3:
        return { color: 'bg-yellow-500', text: 'Moderada', textColor: 'text-yellow-600' };
      case 4:
        return { color: 'bg-green-500', text: 'Fuerte', textColor: 'text-green-600' };
      default:
        return { color: 'bg-gray-300', text: '', textColor: 'text-gray-500' };
    }
  };

  const strengthInfo = getStrengthInfo();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopNavbar />
        <div className="flex-grow flex items-center justify-center mt-[80px]">
          <div className="animate-pulse bg-white p-8 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-[#7620ff] border-t-transparent rounded-full animate-spin mr-2"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Cambiar Contraseña | HomeCooKing</title>
      </Helmet>
      <TopNavbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow mt-[80px]">
        <div className="max-w-md mx-auto">
          {/* Botón de volver */}
          <button
            onClick={() => navigate('/my-account')}
            className="flex items-center text-gray-600 hover:text-[#7620ff] mb-6 transition-colors"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mi cuenta
          </button>

          {/* Encabezado */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#7620ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Cambiar contraseña</h1>
            <p className="text-gray-600 mt-2">Actualiza tu contraseña por una más segura</p>
          </div>
          
          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mensajes de estado */}
              {statusMessage.text && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  statusMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                  statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {statusMessage.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : statusMessage.type === 'error' ? (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5"></div>
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}
              
              {/* Nueva contraseña */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7620ff]/50 focus:border-[#7620ff] transition-colors"
                    placeholder="Ingresa tu nueva contraseña"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Indicador de fortaleza de contraseña */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Fortaleza de la contraseña:</span>
                      <span className={`text-sm font-medium ${strengthInfo.textColor}`}>
                        {strengthInfo.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordStrength.checks.length ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.checks.length && <CheckCircle className="w-3 h-3" />}
                        </div>
                        Al menos 6 caracteres
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.letter ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordStrength.checks.letter ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.checks.letter && <CheckCircle className="w-3 h-3" />}
                        </div>
                        Al menos una letra
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordStrength.checks.number ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.checks.number && <CheckCircle className="w-3 h-3" />}
                        </div>
                        Al menos un número
                      </div>
                      <div className={`flex items-center text-xs ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${passwordStrength.checks.special ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {passwordStrength.checks.special && <CheckCircle className="w-3 h-3" />}
                        </div>
                        Al menos un carácter especial (recomendado)
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirmar nueva contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7620ff]/50 focus:border-[#7620ff] transition-colors"
                    placeholder="Confirma tu nueva contraseña"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Las contraseñas no coinciden
                  </p>
                )}
                {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Las contraseñas coinciden
                  </p>
                )}
              </div>
              
              {/* Botones */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || passwordStrength.score < 2 || formData.newPassword !== formData.confirmPassword}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isSubmitting || passwordStrength.score < 2 || formData.newPassword !== formData.confirmPassword
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#7620ff] text-white hover:bg-[#6510e6]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                      Actualizando contraseña...
                    </span>
                  ) : (
                    'Cambiar contraseña'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/my-account')}
                  className="w-full py-3 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>

            {/* Información de seguridad */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Recomendaciones de seguridad:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Usa una contraseña única que no uses en otros sitios</li>
                    <li>• Combina letras, números y símbolos especiales</li>
                    <li>• Evita información personal como nombres o fechas</li>
                    <li>• Considera usar un gestor de contraseñas</li>
                  </ul>
                </div>
              </div>
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

export default ChangePasswordPage;