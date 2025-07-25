import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResetPasswordModal } from '../components/Modals/ResetPasswordModal';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session, setPasswordRecoveryMode, isPasswordRecovery } = useAuth();

  useEffect(() => {
    console.log('=== ResetPasswordPage useEffect START ===');
    console.log('Current URL:', window.location.href);
    console.log('isPasswordRecovery before setting:', isPasswordRecovery);
    
    // Activar el modo de recuperación de contraseña INMEDIATAMENTE
    console.log('Setting password recovery mode to TRUE');
    setPasswordRecoveryMode(true);

    // Función para extraer parámetros tanto de la URL como del hash
    const getParamsFromUrlAndHash = () => {
      const params: { [key: string]: string } = {};
      
      // Obtener parámetros de la query string
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      // Obtener parámetros del hash (fragment)
      const hash = window.location.hash;
      if (hash) {
        const hashWithoutSymbol = hash.substring(1);
        if (hashWithoutSymbol.includes('=')) {
          const hashParams = new URLSearchParams(hashWithoutSymbol);
          hashParams.forEach((value, key) => {
            params[key] = decodeURIComponent(value);
          });
        }
      }
      
      return params;
    };

    const allParams = getParamsFromUrlAndHash();
    console.log('All params extracted:', allParams);

    // Verificar si hay errores en los parámetros
    if (allParams.error) {
      console.log('Error found in params:', allParams.error);
      let errorMessage = 'Ha ocurrido un error con el enlace de recuperación.';
      
      switch (allParams.error) {
        case 'access_denied':
          if (allParams.error_code === 'otp_expired') {
            errorMessage = 'El enlace de recuperación ha expirado. Por favor, solicita un nuevo enlace.';
          } else {
            errorMessage = 'El enlace de recuperación no es válido. Por favor, solicita un nuevo enlace.';
          }
          break;
        case 'invalid_request':
          errorMessage = 'La solicitud no es válida. Por favor, solicita un nuevo enlace de recuperación.';
          break;
        default:
          errorMessage = `Error: ${allParams.error_description || allParams.error}`;
      }
      
      setError(errorMessage);
      return;
    }

    // Verificar si tenemos los parámetros necesarios para el reset exitoso
    const accessToken = allParams.access_token;
    const refreshToken = allParams.refresh_token;
    const type = allParams.type;

    console.log('Tokens found:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

    if (type === 'recovery' && accessToken && refreshToken) {
      console.log('Valid recovery tokens found - setting up session check');
      
      // Función para verificar la sesión
      const checkForSession = () => {
        console.log('Checking for session...', !!session);
        if (session) {
          console.log('Session found! Showing modal');
          setShowModal(true);
          return true;
        }
        return false;
      };

      // Verificar inmediatamente
      if (!checkForSession()) {
        // Si no hay sesión inmediatamente, verificar periódicamente
        let attempts = 0;
        const maxAttempts = 20; // 10 segundos máximo
        
        const sessionCheckInterval = setInterval(() => {
          attempts++;
          console.log(`Session check attempt ${attempts}/${maxAttempts}`);
          
          if (checkForSession() || attempts >= maxAttempts) {
            clearInterval(sessionCheckInterval);
            if (attempts >= maxAttempts && !session) {
              console.log('Session check timeout - showing modal anyway');
              setShowModal(true);
            }
          }
        }, 500);

        // Cleanup function
        return () => {
          console.log('Cleaning up session check interval');
          clearInterval(sessionCheckInterval);
        };
      }
    } else if (!allParams.error) {
      // Si no tenemos los parámetros correctos y no hay error, redirigir al login
      console.log('No valid recovery params found, redirecting to home');
      setPasswordRecoveryMode(false);
      navigate('/');
    }

    console.log('=== ResetPasswordPage useEffect END ===');
  }, []); // Eliminar dependencias para evitar re-ejecuciones

  // Efecto separado para monitorear cambios en isPasswordRecovery
  useEffect(() => {
    console.log('isPasswordRecovery changed to:', isPasswordRecovery);
  }, [isPasswordRecovery]);

  const handleCloseModal = () => {
    console.log('Closing modal and disabling recovery mode');
    setShowModal(false);
    setPasswordRecoveryMode(false);
    navigate('/');
  };

  const handleRetryReset = () => {
    console.log('Retrying reset - disabling recovery mode');
    setPasswordRecoveryMode(false);
    navigate('/', { 
      state: { 
        openAuthModal: true, 
        showForgotPassword: true 
      } 
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Enlace no válido
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRetryReset}
              className="w-full bg-[#7620ff] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#6518e5] transition-colors"
            >
              Solicitar nuevo enlace
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se procesa la sesión
  if (!showModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7620ff] mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verificando enlace...
          </h1>
          <p className="text-gray-600">
            Por favor espera mientras verificamos tu enlace de recuperación.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Estado de recuperación: {isPasswordRecovery ? 'Activo' : 'Inactivo'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ResetPasswordModal 
        open={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};