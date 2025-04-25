import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { SupabaseAuthService } from '../adapters/api/SupabaseAuthService';
import { SupabaseUserRepository } from '../adapters/api/SupabaseUserRepository';
import { ValidateUserAuth } from '../core/use-cases/ValidateUserAuth';
import { User } from '../core/entities/User';

// Definir el tipo de contexto
interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  userData: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isRegisteredUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<{ success: boolean; error: string | null }>;
  getUserProfile: () => Promise<{ success: boolean; data: User | null; error: string | null }>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inicializar servicios usando Clean Architecture
const authService = new SupabaseAuthService();
const userRepository = new SupabaseUserRepository();
const validateUserAuth = new ValidateUserAuth(userRepository);

// Proveedor del contexto
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisteredUser, setIsRegisteredUser] = useState<boolean>(false);
  
  // Referencia para evitar guardados duplicados
  const userBeingSaved = useRef<{[email: string]: boolean}>({});
  const initialSessionProcessed = useRef<boolean>(false);

  // Obtener datos del perfil del usuario de nuestra base de datos
  const getUserProfile = async (): Promise<{ success: boolean; data: User | null; error: string | null }> => {
    try {
      if (!user?.email) {
        return { success: false, data: null, error: 'No hay un usuario autenticado' };
      }

      // Obtener los datos del usuario desde la base de datos
      const { data, error } = await userRepository.getUserByEmail(user.email);

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
  const updateUserProfile = async (updatedData: Partial<User>): Promise<{ success: boolean; error: string | null }> => {
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
      const { data, error } = await userRepository.updateUser(userData!.id!, updatedData);

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
      // Verificar si el usuario ya existe
      const userExists = await checkRegisteredUser(userEmail);
      
      if (!userExists) {
        // Crear un nuevo usuario con los datos disponibles
        const newUser: User = {
          name: currentUser.user_metadata?.full_name || `Usuario ${source}`,
          email: userEmail,
          phone: currentUser.user_metadata?.phone || '000-000-0000',
          source: source.toLowerCase(),
        };
        
        // Guardar el nuevo usuario en la base de datos
        const { error: saveError } = await userRepository.saveUser(newUser);
        
        if (saveError) {
          console.error('Error al guardar el usuario:', saveError);
          throw new Error(`Error al guardar la información del usuario: ${saveError.message}`);
        }
        
        // Actualizar el estado para reflejar que el usuario ahora está registrado
        setIsRegisteredUser(true);
        return true;
      }
      
      // Si el usuario ya existe, simplemente actualizar el estado
      setIsRegisteredUser(true);
      return true;
    } catch (err) {
      // Propagar el error para que pueda ser manejado adecuadamente
      console.error('Error al guardar el usuario:', err);
      throw err;
    } finally {
      // Siempre limpiar el estado, sea éxito o error
      userBeingSaved.current[userEmail] = false;
    }
  };

  // Efecto para inicializar la sesión
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Obtener la sesión actual
        const { session: currentSession } = await authService.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Verificar si el usuario está registrado en nuestra base de datos
          if (currentSession.user?.email) {
            // Solo procesamos el usuario si no hemos procesado la sesión inicial
            if (!initialSessionProcessed.current) {
              try {
                await safelyCreateUser(currentSession.user, 'Sesión Inicial');
                initialSessionProcessed.current = true;
                
                // Obtener los datos completos del usuario
                await getUserProfile();
              } catch (err) {
                console.error('Error al procesar usuario en la sesión inicial:', err);
                setError(err instanceof Error ? err.message : 'Error al procesar el usuario. Por favor, intenta nuevamente.');
              }
            }
          }
        }
      } catch (err) {
        console.error('Error al inicializar la sesión:', err);
        setError('Error al inicializar la sesión. Por favor, intenta nuevamente.');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Escuchar los cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      
      // Si hay un evento SIGNED_IN con usuario y email, verificamos y posiblemente lo guardamos
      if (event === 'SIGNED_IN' && newSession?.user?.email) {
        try {
          await safelyCreateUser(newSession.user, 'Evento Auth');
          
          // Obtener los datos completos del usuario
          await getUserProfile();
        } catch (err) {
          console.error('Error al procesar usuario después de evento SIGNED_IN:', err);
          setError(err instanceof Error ? err.message : 'Error al procesar el usuario. Por favor, intenta nuevamente.');
        }
      }
      
      setLoading(false);
    });

    // Limpiar la suscripción
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      console.error('Error al cerrar sesión:', err);
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión. Por favor, intenta nuevamente.');
      throw new Error('Error al cerrar sesión. Por favor, intenta nuevamente.');
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
    signInWithGoogle,
    signOut,
    updateUserProfile,
    getUserProfile
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