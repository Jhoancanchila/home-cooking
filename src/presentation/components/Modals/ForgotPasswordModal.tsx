import React, { useState } from 'react';
import { X, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      await resetPassword(email);
      setIsSuccess(true);
      
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al enviar el email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsSuccess(false);
    setErrorMessage(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {isSuccess ? 'Email enviado' : 'Recuperar contraseña'}
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
                ¡Email enviado exitosamente!
              </h3>
              <p className="text-gray-600 mb-6">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-[#7620ff] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#6518e5] transition-colors"
              >
                Entendido
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7620ff] focus:border-transparent outline-none transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-[#7620ff] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#6518e5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar enlace de recuperación'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};