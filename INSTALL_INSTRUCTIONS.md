# 📦 Instrucciones de Instalación

## Backend

1. **Navegar al directorio backend:**
```bash
cd backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
   - Copia el archivo `.env.example` a `.env`
   - Edita `.env` y añade:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=db_galleries

PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:8100
LOG_LEVEL=info

JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
```

4. **Crear la base de datos:**
```sql
CREATE DATABASE db_galleries;
```

5. **Iniciar el servidor:**
```bash
npm start
```

## Frontend

1. **Navegar al directorio frontend:**
```bash
cd frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar la aplicación:**
```bash
ionic serve
```

## 🎉 ¡Listo!

- Backend: http://localhost:8080
- Frontend: http://localhost:8100

## 📝 Notas Importantes

- Las tablas de la base de datos se crean automáticamente al iniciar el backend
- Debes registrarte como nuevo usuario la primera vez que uses la app
- Todas las rutas (excepto login/register) están protegidas con autenticación JWT
- Las contraseñas se encriptan automáticamente con bcrypt

## 🔐 Nuevas Funcionalidades

### Autenticación (UT5):
- ✅ Sistema de registro/login
- ✅ JWT tokens (Bearer)
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Middleware de autenticación en todas las rutas protegidas

### CRUDs Adicionales (UT2):
- ✅ CRUD de Usuarios (perfil)
- ✅ CRUD de Categorías
- ✅ Relaciones: User → Categories → Galleries → Images

### Componentes Ionic Adicionales:
- ✅ ion-segment (filtro de categorías)
- ✅ ion-list + ion-item (lista de categorías)
- ✅ ion-input con labelPlacement="floating" (login/register)
