import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { updatePassword, setPasswordRecoveryMode } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones del lado del cliente
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      await updatePassword(password);
      setIsSuccess(true);
      
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    console.log('Password reset successful, disabling recovery mode');
    // Desactivar el modo de recuperación
    setPasswordRecoveryMode(false);
    onClose();
    navigate('/my-services'); // O la ruta que corresponda después del reset
  };

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setIsSuccess(false);
    setErrorMessage(null);
    setIsLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    
    // Desactivar el modo de recuperación
    setPasswordRecoveryMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {isSuccess ? 'Contraseña actualizada' : 'Nueva contraseña'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            /* Success State */
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Contraseña actualizada exitosamente!
              </h3>
              <p className="text-gray-600 mb-6">
                Tu contraseña ha sido cambiada correctamente. Ya puedes acceder a tu cuenta con la nueva contraseña.
              </p>
              <button
                onClick={handleSuccess}
                className="w-full bg-[#7620ff] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#6518e5] transition-colors"
              >
                Continuar
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nueva contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresa tu nueva contraseña"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7620ff] focus:border-transparent outline-none transition-all"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirma tu nueva contraseña"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7620ff] focus:border-transparent outline-none transition-all"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !password.trim() || !confirmPassword.trim()}
                  className="w-full bg-[#7620ff] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#6518e5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar contraseña'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};