# 📱 Guía para Ejecutar la App en Android Studio

Esta guía te ayudará a ejecutar la aplicación en un emulador Android o dispositivo físico.

---

## ⚠️ IMPORTANTE: Requisitos de Ruta

**El proyecto NO puede estar en una ruta con caracteres especiales (acentos, ñ, º, etc.)**

❌ **Rutas NO válidas:**
- `C:\Users\Usuario\Desktop\3º DAM\...`
- `C:\Users\José\Documentos\...`
- `C:\Users\Usuario\Año 2024\...`

✅ **Rutas válidas:**
- `C:\Users\Usuario\Desktop\PGL\...`
- `C:\Users\Usuario\Documents\GalleryApp\...`
- `C:\Projects\GalleryApp\...`

**Si tu proyecto está en una ruta con caracteres especiales, muévelo antes de continuar.**

---

## 📋 Requisitos Previos

### 1. Software Necesario

- **Node.js** (v14 o superior) - [Descargar](https://nodejs.org/)
- **Android Studio** - [Descargar](https://developer.android.com/studio)
- **MySQL Server** (v5.7 o superior) - [Descargar](https://dev.mysql.com/downloads/mysql/)

### 2. Instalar Ionic CLI

```bash
npm install -g @ionic/cli
```

### 3. Configurar Android Studio

1. Abre Android Studio
2. Ve a `Tools` → `SDK Manager`
3. En la pestaña `SDK Platforms`, marca:
   - ✅ Android 13.0 (API 33) o superior
4. En la pestaña `SDK Tools`, marca:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
5. Click en `Apply` → `OK`

### 4. Crear un Dispositivo Virtual (Emulador)

1. En Android Studio, ve a `Tools` → `Device Manager`
2. Click en `Create Device` (botón +)
3. Selecciona un dispositivo (recomendado: **Pixel 5**)
4. Click `Next`
5. Selecciona una imagen del sistema: **API 33 (Android 13)** o superior
   - Si no está descargada, click en el icono de descarga ⬇️
6. Click `Next` → `Finish`

---

## 🚀 Pasos para Ejecutar la App

### Paso 1: Configurar la Base de Datos

1. Abre MySQL Workbench o tu cliente MySQL
2. Ejecuta:
   ```sql
   CREATE DATABASE db_galleries;
   ```

3. En la carpeta `backend`, copia `.env.example` a `.env`:
   ```bash
   cd backend
   copy .env.example .env
   ```

4. Edita el archivo `.env` con tus credenciales de MySQL:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=db_galleries
   
   PORT=8080
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:8100
   LOG_LEVEL=info
   
   JWT_SECRET=GalleriesApp2024SecretKeyForJWTTokensDoNotShare
   ```

### Paso 2: Instalar Dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Paso 3: Iniciar el Backend

Abre una terminal (puede ser en VSCode) y ejecuta:

```bash
cd backend
npm start
```

Debes ver: `Server is running on port 8080`

**⚠️ Deja esta terminal abierta. El backend debe estar corriendo mientras usas la app.**

### Paso 4: Compilar el Frontend para Android

Abre otra terminal y ejecuta:

```bash
cd frontend
ionic build
```

### Paso 5: Configurar Capacitor (Solo la Primera Vez)

```bash
npm install @capacitor/android
npx cap add android
npx cap sync
```

**Nota:** Si ya existe la carpeta `android`, omite `npx cap add android` y ejecuta solo `npx cap sync`.

### Paso 6: Abrir el Proyecto en Android Studio

```bash
npx cap open android
```

Esto abrirá Android Studio automáticamente con el proyecto.

### Paso 7: Ejecutar la App en el Emulador

1. **Espera** a que Android Studio termine de cargar el proyecto (1-2 minutos)
2. **Inicia el emulador:**
   - Ve a `Tools` → `Device Manager`
   - Click en el botón ▶️ (Play) junto a tu dispositivo virtual
   - Espera a que el emulador arranque (1-2 minutos la primera vez)
3. **Verifica que el emulador esté seleccionado:**
   - En la barra superior de Android Studio, verifica que aparezca tu emulador en el dropdown
4. **Click en Run (▶️ verde)** en la barra superior
5. La app se instalará automáticamente en el emulador

### Paso 8: Usar la App

1. La app se abrirá automáticamente en el emulador
2. **Regístrate** con un email y contraseña
3. Empieza a crear galerías y subir imágenes
4. Para probar la cámara:
   - Navega a una galería
   - Click en el botón FAB (+)
   - Selecciona "Tomar foto"
   - El emulador tiene una cámara virtual que funcionará

---

## 🔄 Ejecutar la App Después de la Primera Vez

### Si NO hiciste cambios en el código:

1. **Inicia el backend** (terminal):
   ```bash
   cd backend
   npm start
   ```

2. **Abre Android Studio:**
   - File → Open → Selecciona la carpeta `frontend/android`

3. **Inicia el emulador** (Device Manager → ▶️)

4. **Click en Run (▶️ verde)**

### Si hiciste cambios en el código:

1. **Inicia el backend** (terminal):
   ```bash
   cd backend
   npm start
   ```

2. **Compila los cambios** (otra terminal):
   ```bash
   cd frontend
   ionic build
   npx cap sync
   ```

3. **En Android Studio:**
   - Inicia el emulador
   - Click en Run (▶️ verde)

---

## 🔧 Solución de Problemas

### Error: "Your project path contains non-ASCII characters"

**Causa:** La ruta del proyecto tiene caracteres especiales (º, ñ, acentos, etc.)

**Solución:** Mueve el proyecto a una ruta sin caracteres especiales.

### Error: "Could not find the android platform"

**Solución:**
```bash
cd frontend
npm install @capacitor/android
npx cap add android
npx cap sync
```

### El emulador no arranca

**Solución:**
1. Ve a `Tools` → `Device Manager`
2. Click en el icono ⚙️ junto al dispositivo
3. Click en `Wipe Data`
4. Intenta arrancar de nuevo

### La app no se conecta al backend

**Causa:** El emulador no puede acceder a `localhost` del PC.

**Solución:** Cambia las URLs en los servicios del frontend:
- De: `http://localhost:8080`
- A: `http://10.0.2.2:8080`

Archivos a modificar:
- `frontend/src/app/services/gallery.service.ts`
- `frontend/src/app/services/image.service.ts`
- `frontend/src/app/services/auth.service.ts`
- `frontend/src/app/services/category.service.ts`
- `frontend/src/app/services/user.service.ts`

Luego recompila:
```bash
cd frontend
ionic build
npx cap sync
```

### Error al compilar en Android Studio

**Solución:**
1. En Android Studio: `Build` → `Clean Project`
2. Luego: `Build` → `Rebuild Project`
3. Intenta ejecutar de nuevo

---

## 📸 Probar la Funcionalidad de Cámara

1. Abre la app en el emulador
2. Regístrate o inicia sesión
3. Crea una galería
4. Click en el botón FAB (+)
5. Selecciona "Tomar foto"
6. La cámara virtual del emulador se abrirá
7. Captura la foto
8. La imagen se guardará en la galería

---

## 💡 Consejos

- **Mantén el backend corriendo** mientras usas la app
- **El emulador consume muchos recursos**, cierra otras aplicaciones si va lento
- **La primera vez tarda más** en compilar y arrancar
- **Usa Ctrl+C** en la terminal para detener el backend cuando termines

---

## 📞 Soporte

Si tienes problemas, verifica:
1. ✅ El backend está corriendo (`npm start` en la carpeta backend)
2. ✅ La base de datos MySQL está activa
3. ✅ El archivo `.env` tiene las credenciales correctas
4. ✅ El emulador está iniciado
5. ✅ La ruta del proyecto no tiene caracteres especiales

---

**¡Listo! Ya puedes usar la aplicación en el emulador Android.** 🎉
