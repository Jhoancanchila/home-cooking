import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { SupabaseAuthService } from '../adapters/api/SupabaseAuthService';
import { SupabaseUserProfileRepository } from '../adapters/api/SupabaseUserProfileRepository';
import { ValidateUserAuth, ValidateUserInfoAuth } from '../core/use-cases/ValidateUserAuth';
import { UserProfile } from '../core/entities/User';
import { RequestPasswordReset, UpdatePassword } from '../core/use-cases/ResetPassword';

// Definir el tipo de contexto
interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  userData: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isRegisteredUser: boolean;
  setIsRegisteredUser: React.Dispatch<React.SetStateAction<boolean>>; // Para actualizar el estado de isRegisteredUser
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userData: Partial<UserProfile>) => Promise<{ success: boolean; error: string | null }>;
  getUserProfile: () => Promise<{ success: boolean; data: UserProfile | null; error: string | null }>;
  signUpWithEmail: ( email: string, password: string)=> Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  isPasswordRecovery: boolean; // Para manejar el estado de recuperación de contraseña
  setPasswordRecoveryMode: (mode: boolean) => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inicializar servicios usando Clean Architecture
const authService = new SupabaseAuthService();
const authServiceRepository = new SupabaseAuthService();
const userProfileRepository = new SupabaseUserProfileRepository();
const validateUserAuth = new ValidateUserAuth(userProfileRepository);
const validateUserInfoAuth = new ValidateUserInfoAuth(userProfileRepository);
const requestPasswordReset = new RequestPasswordReset(authServiceRepository);
const updatePasswordUseCase = new UpdatePassword(authServiceRepository);

// Proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisteredUser, setIsRegisteredUser] = useState<boolean>(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  
  // Referencia para evitar guardados duplicados
  const userBeingSaved = useRef<{[email: string]: boolean}>({});
  const initialSessionProcessed = useRef<boolean>(false);

  // Obtener datos del perfil del usuario de nuestra base de datos
  const getUserProfile = async (): Promise<{ success: boolean; data: UserProfile | null; error: string | null }> => {
    try {
      if (!user?.email) {
        return { success: false, data: null, error: 'No hay un usuario autenticado' };
      }

      // Obtener los datos del usuario desde la base de datos
      const { data, error } = await userProfileRepository.getUserProfileByEmail(user.email);

      if (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        return { success: false, data: null, error: error.message };
      }

      if (!data) {
        return { success: false, data: null, error: 'No se encontraron datos del usuario' };
      }

      // Actualizar el estado con los datos obtenidos
      setUserData(data);
      return { success: true, data, error: null };
    } catch (err) {
      console.error('Error al obtener el perfil del usuario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener el perfil';
      return { success: false, data: null, error: errorMessage };
    }
  };

  // Actualizar los datos del perfil del usuario
  const updateUserProfile = async (updatedData: Partial<UserProfile>): Promise<{ success: boolean; error: string | null }> => {
    try {
      if (!userData || !userData.id) {
        // Si no tenemos datos del usuario, intentamos obtenerlos primero
        const { success, data, error } = await getUserProfile();
        if (!success || !data || !data.id) {
          return { success: false, error: error || 'No se pudieron obtener los datos del usuario para actualizar' };
        }
        // Ahora tenemos userData con un ID válido
      }

      // Actualizar los datos en la base de datos
      const { data, error } = await userProfileRepository.updateUserProfile(userData!.id!, updatedData);

      if (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        return { success: false, error: 'No se pudo actualizar el perfil' };
      }

      // Actualizar el estado local con los datos actualizados
      setUserData(data[0]);
      return { success: true, error: null };
    } catch (err) {
      console.error('Error al actualizar el perfil del usuario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el perfil';
      return { success: false, error: errorMessage };
    }
  };

  // Comprobar si el usuario está registrado previamente
  const checkRegisteredUser = async (email: string): Promise<boolean> => {
    if (!email) return false;
    
    try {
      const isRegistered = await validateUserAuth.execute(email);
      setIsRegisteredUser(isRegistered);
      return isRegistered;
    } catch (err) {
      console.error('Error al verificar si el usuario existe:', err);
      // No establecemos isRegisteredUser como false aquí porque podría ser un error temporal
      // y no queremos romper el estado de la aplicación
      throw new Error('No se pudo verificar si el usuario existe. Por favor, intenta nuevamente.');
    }
  };

  // Función para guardar un usuario de forma segura (evitando duplicados)
  const safelyCreateUser = async (currentUser: SupabaseUser, source: string): Promise<boolean> => {
    const userEmail = currentUser.email;
    if (!userEmail) {
      throw new Error('No se pudo obtener el email del usuario. Por favor, intenta nuevamente.');
    }

    // Si ya estamos guardando este usuario, esperar hasta completar o fallar
    if (userBeingSaved.current[userEmail]) {
      // Esperar un máximo de 5 segundos para que complete la operación en curso
      let attempts = 0;
      while (userBeingSaved.current[userEmail] && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      // Si después de esperar sigue en proceso, algo está mal
      if (userBeingSaved.current[userEmail]) {
        throw new Error('El proceso de registro está tardando demasiado. Por favor, intenta nuevamente.');
      }
      
      // Verificar si el usuario ya existe después de esperar
      const userExists = await checkRegisteredUser(userEmail);
      return userExists;
    }

    // Marcar que estamos guardando este usuario
    userBeingSaved.current[userEmail] = true;

    try {
      // Primero verificar si el usuario existe por email en la tabla user_profile
      const { data: existingUser } = await userProfileRepository.getUserProfileByEmail(userEmail);
      
      // Si el usuario existe en la tabla user_profile
      if (existingUser) {
        // Verificar si no tiene auth_id y actualizarlo si es necesario
        if (!existingUser.auth_id && currentUser.id && existingUser.id) {
          // Actualizar directamente con el repositorio en lugar de usar updateUserProfile
          // ya que en este punto userData podría no estar establecido todavía
          const { data, error } = await userProfileRepository.updateUserProfile(
            existingUser.id,
            { auth_id: currentUser.id }
          );
          
          if (error) {
            console.error('No se pudo actualizar el auth_id:', error.message);
          } else if (data && data.length > 0) {
            // Actualizar el estado con los datos actualizados
            setUserData(data[0]);
          }
        }
        
        setIsRegisteredUser(true);
        setUserData(existingUser);
        return true;
      }
      
      // Si el usuario no existe en user_profile, verificar si está registrado en el sistema de autenticación
      const userExists = await checkRegisteredUser(userEmail);
      
      if (!userExists) {
        // Crear un nuevo perfil de usuario con los datos disponibles
        const newUserProfile: UserProfile = {
          auth_id: currentUser.id,
          name: currentUser.user_metadata?.full_name || `Usuario ${source}`,
          email: userEmail,
          phone: currentUser.user_metadata?.phone || '000-000-0000',
          source: source.toLowerCase(),
        };
        
        // Guardar el nuevo perfil de usuario en la base de datos
        const { error: saveError } = await userProfileRepository.saveUserProfile(newUserProfile);
        
        if (saveError) {
          console.error('Error al guardar el perfil de usuario:', saveError);
          throw new Error(`Error al guardar la información del perfil de usuario: ${saveError.message}`);
        }
        
        // Actualizar el estado para reflejar que el usuario ahora está registrado
        setIsRegisteredUser(true);
        
        // Obtener los datos completos del usuario recién creado
        await getUserProfile();
        
        return true;
      }
      
      // Si el usuario ya existe, simplemente actualizar el estado
      setIsRegisteredUser(true);
      
      // Obtener los datos completos del usuario
      await getUserProfile();
      
      return true;
    } catch (err) {
      // Propagar el error para que pueda ser manejado adecuadamente
      console.error('Error al guardar el perfil de usuario:', err);
      throw err;
    } finally {
      // Siempre limpiar el estado, sea éxito o error
      userBeingSaved.current[userEmail] = false;
    }
  };

  // Función para activar/desactivar el modo de recuperación de contraseña
  const setPasswordRecoveryMode = (mode: boolean) => {
    setIsPasswordRecovery(mode);
  };

  // Efecto para inicializar la sesión
  useEffect(() => {
    const initializeSession = async () => {
      try {

        setLoading(true);
        
        // Verificar si estamos en un flujo de recuperación de contraseña ANTES de obtener la sesión
        const isRecoveryFlow = window.location.pathname === '/reset-password';
        
        if (isRecoveryFlow) {
          setIsPasswordRecovery(true);
        }

        // Obtener la sesión actual
        const { session: currentSession } = await authService.getSession();
        
        if (currentSession ) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Solo procesar el perfil del usuario si NO estamos en un flujo de recuperación de contraseña
          if (!isRecoveryFlow && !isPasswordRecovery) {
            // Verificar si el usuario está registrado en nuestra base de datos
            if (currentSession.user?.email) {
              // Solo procesamos el usuario si no hemos procesado la sesión inicial
              if (!initialSessionProcessed.current) {
                try {
                  await safelyCreateUser(currentSession.user, 'Sesión Inicial');
                  initialSessionProcessed.current = true;
                  // safelyCreateUser ya se encarga de obtener el perfil del usuario
                } catch (err) {
                  console.error('Error al procesar usuario en la sesión inicial:', err);
                  setError(err instanceof Error ? err.message : 'Error al procesar el usuario. Por favor, intenta nuevamente.');
                }
              }
            }
          } else {
            console.log('Skipping profile processing - recovery flow active');
            initialSessionProcessed.current = true;
          }         
        }
      } catch (err) {
        console.error('Error al inicializar la sesión:', err);
        setError('Error al inicializar la sesión. Por favor, intenta nuevamente.');
        throw err;
      } finally {
        // Solo setear loading a false si NO estamos en recovery flow
        const isRecoveryFlow = window.location.pathname === '/reset-password';
        if (!isRecoveryFlow) {
          setLoading(false);
        } else {
          console.log('Keeping loading true - in recovery flow during initialization');
        }
      }
    };

    initializeSession();

    // Escuchar los cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);

      // Verificar si estamos en un flujo de recuperación de contraseña
      const isRecoveryFlow = window.location.pathname === '/reset-password' || isPasswordRecovery;
      
      // Si hay un evento SIGNED_IN con usuario y email, verificamos y posiblemente lo guardamos
      if (event === 'SIGNED_IN' && newSession?.user?.email && !isRecoveryFlow) {
        try {
          await safelyCreateUser(newSession.user, 'Evento Auth');
          // safelyCreateUser ya se encarga de obtener el perfil y actualizar estados
        } catch (err) {
          console.error('Error al procesar usuario después de evento SIGNED_IN:', err);
          setError(err instanceof Error ? err.message : 'Error al procesar el usuario. Por favor, intenta nuevamente.');
        }
      }else if (event === 'SIGNED_IN' && isRecoveryFlow) {
      console.log('SIGNED_IN event in recovery flow - skipping automatic processing');
      // En modo de recuperación, solo establecemos que el usuario está registrado
      if (newSession?.user?.email) {
        try {
          const isRegistered = await checkRegisteredUser(newSession.user.email);
          console.log('User registration status in recovery:', isRegistered);
        } catch (err) {
          console.error('Error checking user registration in recovery flow:', err);
        }
      }
    }

      if (!isRecoveryFlow) {
        setLoading(false);
      } else {
        console.log('Keeping loading state - in recovery flow');
      }
      
    });

    // Limpiar la suscripción
    return () => {
      subscription.unsubscribe();
    };
  }, [isPasswordRecovery]);

  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Esta función realmente solo inicia el proceso de redirección,
      // el manejo del usuario se realiza en los eventos de autenticación
      // cuando el usuario regresa de Google
      const { error } = await authService.signInWithGoogle();

      if (error) {
        throw error;
      }
      
      // No necesitamos intentar guardar el usuario aquí, ya que será manejado 
      // por el efecto useEffect y el AuthStateChange después de regresar de Google
      
    } catch (err: unknown) {
      console.error('Error al iniciar sesión con Google:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
      throw new Error('Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await validateUserInfoAuth.execute(email);

      if (data?.provider && data?.provider.length > 0 && data?.provider.includes('google')) {
        throw new Error(`Este usuario ya se encuentra registrado. Por favor, inicia sesión usando alguno de estos métodos ${data.provider.join(', ')}.`);
      }
      
      const { error } = await authService.signUpWithEmail(email, password);
      
      if (error) {
        throw error;
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar con email. Por favor, intenta nuevamente.');
      throw new Error(`${err}`);
    }
    finally {
      setLoading(false);
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones básicas de entrada
      if (!email || !email.trim()) {
        throw new Error('El email es requerido.');
      }
      if (!password || !password.trim()) {
        throw new Error('La contraseña es requerida.');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('El formato del email no es válido.');
      }

      // Intentar iniciar sesión
      const { error: signInError } = await authService.signInWithEmail(email, password);
      if (signInError) {
        // Proporcionar mensajes más específicos según el tipo de error de Supabase
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Email o contraseña incorrectos. Por favor, verifica tus datos.');
        }
        if (signInError.message.includes('Email not confirmed')) {
          throw new Error('Tu email no ha sido confirmado. Revisa tu bandeja de entrada y confirma tu cuenta.');
        }
        if (signInError.message.includes('Too many requests')) {
          throw new Error('Demasiados intentos de inicio de sesión. Por favor, espera unos minutos antes de intentar nuevamente.');
        }
        if (signInError.message.includes('Network')) {
          throw new Error('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
        }
        
        // Error genérico si no coincide con ningún patrón específico
        throw new Error(`Error al iniciar sesión: ${signInError.message}`);
      }
     
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al iniciar sesión. Por favor, intenta nuevamente.';
      setError(errorMessage);
      // Re-lanzar el error para que el modal pueda manejarlo
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
     

  // Cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await authService.signOut();
      
      if (error) {
        throw error;
      }
      
      setSession(null);
      setUser(null);
      setUserData(null);
      setIsRegisteredUser(false);
      // Reseteamos el control de sesión inicial
      initialSessionProcessed.current = false;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión. Por favor, intenta nuevamente.');
      throw new Error('Error al cerrar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Solicitar reset de contraseña
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validar que el email no esté vacío
      if (!email || !email.trim()) {
        throw new Error('El email es requerido.');
      }

      const { success, error } = await requestPasswordReset.execute(email);
      
      if (!success || error) {
        throw error || new Error('Error al solicitar reset de contraseña');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al solicitar reset de contraseña. Por favor, intenta nuevamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar contraseña
  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const { success, error } = await updatePasswordUseCase.execute(newPassword);
      
      if (!success || error) {
        throw error || new Error('Error al actualizar contraseña');
      }

      setIsPasswordRecovery(false); // Resetear el estado de recuperación de contraseña
      // Aquí podrías redirigir al usuario a una página de éxito o dashboard

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar contraseña. Por favor, intenta nuevamente.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const value = {
    session,
    user,
    userData,
    loading,
    error,
    isAuthenticated: !!session,
    isRegisteredUser,
    setIsRegisteredUser,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    getUserProfile,
    signUpWithEmail,
    signInWithEmail,
    updatePassword,
    resetPassword,
    isPasswordRecovery,
    setPasswordRecoveryMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  
  return context;
}; 