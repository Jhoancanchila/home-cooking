import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLocation, useNavigate } from 'react-router-dom';
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  defaultMode = "login",
  setMode,
}) => {
  // Estado interno sincronizado con defaultMode
  const [showPw, setShowPw] = useState(false);
  const [showPwRepeat, setShowPwRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Usamos el contexto de autenticación y navegación
  const { signInWithGoogle, signUpWithEmail, isRegisteredUser, isAuthenticated, signInWithEmail, isPasswordRecovery } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (open) {
      setMode(defaultMode);
      setShowPw(false);
      setShowPwRepeat(false);
      setErrorMessage(null);
      setAuthStatus('');
    }
  }, [open, defaultMode, setMode]);

  // Efecto para manejar la redirección después de autenticación exitosa
  useEffect(() => {
    // Solo redirigir si estamos autenticados y registrados en la base de datos
    if (isAuthenticated && isRegisteredUser && !isLoading && !isPasswordRecovery) {
      setAuthStatus('Autenticación exitosa. Redirigiendo...');
      onClose(); // Cerrar el modal después del inicio de sesión exitoso
      navigate('/my-services'); // Redirigir a la página de servicios
      setIsLoading(false);
    } 
    // Si estamos autenticados pero no registrados, mostrar mensaje de espera
    else if (isAuthenticated && !isRegisteredUser && !isLoading && !isPasswordRecovery) {
      setAuthStatus('Completando el registro. Por favor espere...');
    }
  }, [isAuthenticated, isRegisteredUser, isLoading, navigate, onClose, isPasswordRecovery]);

  // Efecto para manejar el estado de navegación (forgot password)
  useEffect(() => {
    if (location.state?.openAuthModal && location.state?.showForgotPassword) {
      setShowForgotPassword(true);
      // Limpiar el estado para evitar que se abra automáticamente de nuevo
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  if (!open) return null;

  const isLogin = defaultMode === "login";
  const title = isLogin ? "Accede a tu cuenta" : "Crea tu cuenta";
  const subtitle = isLogin
    ? (
      <>
        Si eres cliente, gestiona tu solicitud.<br />
        Si eres Chef, gestiona tus servicios, platos y menús.
      </>
    )
    : (
      <>Registra tu cuenta para acceder y comenzar a usar nuestra plataforma.</>
    );
  const mainButtonText = isLogin ? "Acceder" : "Registrarse";
  const googleButtonText = isLogin ? "Acceder con Google" : "Registrarse con Google";
  const toggleLinkText = isLogin
    ? (
      <>¿No tienes cuenta? <span className="text-[#7620ff] underline">Regístrate aquí</span></>
    ) : (
      <>¿Ya tienes cuenta? <span className="text-[#7620ff] underline">Inicia sesión</span></>
    );

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setAuthStatus('Iniciando proceso de autenticación con Google...');
      
      // Iniciar proceso de autenticación con Google
      await signInWithGoogle();
      
      // No cerramos el modal ni navegamos aquí,
      // esto lo hará el useEffect cuando detecte isAuthenticated y isRegisteredUser
      
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      
      setAuthStatus('Error de autenticación.');
      setErrorMessage(
        error instanceof Error 
        ? error.message 
        : "Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo más tarde."
      );
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordRepeat = formData.get("passwordRepeat") as string;
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    const isValidPassword = password.length >= 6;
    const isValidPasswordRepeat = password === passwordRepeat;
    if (!isValidEmail) {
      setErrorMessage("Por favor, introduce un email válido.");
      setIsLoading(false);
      return;
    }
    if (!isValidPassword) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }
    if (!isValidPasswordRepeat) {
      setErrorMessage("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }
    
    setAuthStatus('Registrando cuenta...');
    try {
      await signUpWithEmail(email, password);
      setAuthStatus('Registro exitoso. Redirigiendo...');
    } catch (error) {
      setErrorMessage(
        error instanceof Error 
        ? error.message 
        : "Hubo un problema al registrarte. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
      setAuthStatus('');
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setAuthStatus('');
    
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Validaciones básicas del lado del cliente
    if (!email?.trim()) {
      setErrorMessage("Por favor, introduce tu email.");
      setIsLoading(false);
      return;
    }
    
    if (!password?.trim()) {
      setErrorMessage("Por favor, introduce tu contraseña.");
      setIsLoading(false);
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, introduce un email válido.");
      setIsLoading(false);
      return;
    }
    
    try {
      setAuthStatus('Verificando credenciales...');
      await signInWithEmail(email, password);
      
      // Si llegamos aquí, el inicio de sesión fue exitoso
      setAuthStatus('Iniciando sesión...');
      
      // El resto se maneja en el useEffect cuando cambie isAuthenticated e isRegisteredUser
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      
      // Limpiar el estado de autenticación
      setAuthStatus('');
      
      // Mostrar el mensaje de error específico que viene del contexto
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo más tarde.";
      
      setErrorMessage(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" style={{ animationDuration: "1.8s" }}>
        <div className="relative bg-white rounded-3xl shadow-lg max-w-md w-[90vw] px-8 py-8 pt-10 flex flex-col items-stretch animate-slide-in-top"
          style={{ animationDuration: "1.8s" }}>
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <X size={26} />
          </button>
          {/* Encabezado */}
          <h2
            className="text-2xl font-bold text-[#7620ff] text-center mb-2"
            style={{ lineHeight: "1.1" }}
          >
            {title}
          </h2>
          <div className="text-gray-500 text-center text-base mb-6 leading-normal">
            {subtitle}
          </div>
          
          {/* Mensaje de error */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  {errorMessage}
                </div>
              </div>
              {isAuthenticated && !isRegisteredUser && (
                <div className="mt-2">
                  <button
                    onClick={handleGoogleSignIn}
                    className="text-blue-700 underline hover:text-blue-800 transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Estado de autenticación */}
          {authStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {authStatus}
              </div>
            </div>
          )}
          
          {/* Formulario */}
          <form className="w-full flex flex-col gap-4" onSubmit={isLogin ? handleSignIn : handleSignUp}>
            <div>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border-2 border-gray-200 px-5 py-3 text-base outline-none focus:border-[#7620ff] transition shadow-sm"
                placeholder="Email *"
                autoComplete={isLogin ? "username" : "new-username"}
              />
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                required
                className="w-full rounded-xl border-2 border-gray-200 px-5 py-3 text-base outline-none focus:border-[#7620ff] transition shadow-sm pr-11"
                placeholder="Contraseña *"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPw ? (
                  // Eye-off
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.03 10.03 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a12.17 12.17 0 0 1 4.22-5.09M6.52 6.52A10.06 10.06 0 0 1 12 4c5 0 9.27 3.11 11 7.5a12.12 12.12 0 0 1-2.06 3.35M1 1l22 22"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  // Eye
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            {/* Campo repetir contraseña solo para registrar */}
            {!isLogin && (
              <div className="relative">
                <input
                  type={showPwRepeat ? "text" : "password"}
                  required
                  name="passwordRepeat"
                  className="w-full rounded-xl border-2 border-gray-200 px-5 py-3 text-base outline-none focus:border-[#7620ff] transition shadow-sm pr-11"
                  placeholder="Repite la contraseña *"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-700"
                  onClick={() => setShowPwRepeat((v) => !v)}
                  aria-label={showPwRepeat ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwRepeat ? (
                    // Eye-off
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.03 10.03 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a12.17 12.17 0 0 1 4.22-5.09M6.52 6.52A10.06 10.06 0 0 1 12 4c5 0 9.27 3.11 11 7.5a12.12 12.12 0 0 1-2.06 3.35M1 1l22 22"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  ) : (
                    // Eye
                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            )}
            <button
              type="submit"
              className="bg-[#7620ff] hover:bg-[#6510e6] transition font-semibold rounded-xl py-3 mt-2 text-white text-base shadow-inner"
              disabled={isLoading}
              aria-label={mainButtonText}
            >
              {isLoading ? "Procesando..." : mainButtonText}
            </button>
            
          </form>
          {/* Acciones extra */}
          {isLogin && (
            <div className="w-full mt-5 mb-2 flex justify-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="font-semibold text-sm underline hover:text-[#7620ff] transition text-black cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}
          <div className="w-full flex justify-center mt-2 mb-2">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-[#7620ff] transition"
              onClick={() => setMode(isLogin ? "signup" : "login")}
              aria-label={isLogin ? "Ir a registro" : "Ir a acceso"}
            >
              {toggleLinkText}
            </button>
          </div>
          {/* Divider y botón Google */}
          <div className="flex items-center w-full my-1">
            <hr className="flex-1 border-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">Continuar con</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <div className="flex flex-row gap-3 justify-center mt-3">
            <button
              type="button"
              className="border-2 border-gray-200 rounded-xl p-3 hover:bg-gray-50 transition flex items-center gap-2 justify-center w-full"
              aria-label={googleButtonText}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/></svg>
              <span className="font-semibold text-base text-[#7620ff]">
                {isLoading ? "Procesando..." : googleButtonText}
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default AuthModal;