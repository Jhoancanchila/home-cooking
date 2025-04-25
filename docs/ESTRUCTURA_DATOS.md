# Estructura de Datos - Sazón Regional

Este documento describe la estructura de datos de la aplicación Sazón Regional, enfocándose en la separación entre la información del usuario y los servicios solicitados.

## Entidades Principales

### Usuario (User)

La entidad `User` contiene la información relevante del usuario:

```typescript
interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  source?: string;
  location?: string;
  created_at?: string;
}
```

Esta entidad almacena solo la información básica y relevante del usuario:
- **name**: Nombre completo del usuario
- **email**: Correo electrónico (usado para autenticación)
- **phone**: Número de teléfono 
- **source**: De dónde conoció el servicio

### Servicio (Service)

La entidad `Service` contiene toda la información relacionada con los servicios solicitados por los usuarios:

```typescript
interface Service {
  id?: string;
  user_id: string;
  service?: string;
  occasion?: string;
  location?: string;
  persons?: string;
  meal_time?: string;
  cuisine?: string;
  event_date?: string;
  description?: string;
  created_at?: string;
}
```

Cada servicio está relacionado con un usuario a través del campo `user_id`, y contiene:
- **service**: Tipo de servicio (único, virtual, receta)
- **occasion**: Ocasión del evento
- **location**: Ubicación específica del evento
- **persons**: Número de personas
- **meal_time**: Hora de la comida
- **cuisine**: Tipo de cocina
- **event_date**: Fecha del evento
- **description**: Descripción adicional

## Cambios Realizados

1. Se ha separado la información del usuario de la información de servicios, creando una relación uno a muchos donde un usuario puede tener múltiples servicios.

2. Se crearon migraciones SQL para:
   - Crear la nueva tabla `services`
   - Actualizar la tabla `users` eliminando los campos que ahora están en `services`
   - Establecer políticas de seguridad para ambas tablas

3. Se modificaron los casos de uso para:
   - `SaveUserData`: Guardar información básica del usuario
   - `SaveServiceData`: Guardar información del servicio asociada a un usuario

4. Se actualizó el flujo de la aplicación para:
   - Primero guardar los datos del usuario
   - Obtener el ID del usuario creado
   - Luego guardar los datos del servicio vinculados a ese usuario

## Beneficios de esta Estructura

- **Mejor organización de datos**: Separa claramente qué datos pertenecen al usuario y cuáles al servicio
- **Facilita la relación uno a muchos**: Un usuario puede solicitar múltiples servicios 
- **Optimiza consultas**: Permite consultar servicios específicos sin cargar toda la información del usuario
- **Mejora la seguridad**: Permite aplicar políticas de acceso más específicas por entidad 