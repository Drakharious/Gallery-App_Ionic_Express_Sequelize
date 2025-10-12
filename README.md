# Galería de Imágenes - Proyecto Full Stack

Aplicación completa para gestión de galerías de imágenes con diseño futurista.

- **Backend:** API REST con Node.js, Express y Sequelize
- **Frontend:** Aplicación móvil/web con Ionic + Angular

## Tabla de Contenidos

- [Inicio Rápido](#-inicio-rápido-quick-start)
- [Backend API](#galería-de-imágenes---backend-api)
- [Frontend](#galería-de-imágenes---frontend)

## 🚀 Inicio Rápido (Quick Start)

**Requisitos previos:** Node.js, npm, MySQL

1. **Backend:**

```bash
cd backend
npm install
# Configurar .env con credenciales MySQL
npm start
```

2. **Frontend:**

```bash
cd frontend
npm install
ionic serve
```

3. **Abrir:** http://localhost:8100

---

# Galería de Imágenes - Backend API

API REST para gestión de galerías de imágenes con subida de archivos, construida con Node.js, Express y Sequelize.

## Comenzando 🚀

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### Pre-requisitos 📋

Necesitas tener instalado lo siguiente:

```
Node.js (v14 o superior)
npm (v6 o superior)
MySQL Server (v5.7 o superior)
MySQL Workbench (opcional, para gestión de base de datos)
```

### Instalación 🔧

Sigue estos pasos para configurar el entorno de desarrollo:

**1. Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd Gallery App_Ionic_Express_Sequelize/backend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Crear la base de datos en MySQL**

Abre MySQL Workbench o tu cliente MySQL preferido y ejecuta:

```sql
CREATE DATABASE db_galleries;
```

**4. Configurar variables de entorno**

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
copy .env.example .env
```

Edita el archivo `.env` con tus credenciales de MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=db_galleries

PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:8100
LOG_LEVEL=info
```

**5. Iniciar el servidor**

```bash
npm start
```

Para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:8080`

Las tablas de la base de datos se crearán automáticamente al iniciar el servidor.

## Estructura del Proyecto 🛠️

```
backend/
├── config/          # Configuraciones (DB, logger, multer)
├── controllers/     # Lógica de negocio
├── middleware/      # Middlewares (validación, errores)
├── models/          # Modelos de Sequelize
├── routes/          # Definición de rutas
├── utils/           # Utilidades (generadores aleatorios)
├── uploads/         # Almacenamiento de imágenes
├── logs/            # Archivos de log
├── .env             # Variables de entorno (no incluido en git)
├── .env.example     # Plantilla de variables de entorno
└── index.js         # Punto de entrada
```

## API Endpoints ⚙️

**📮 Colección de Postman (Galerías):** [Probar APIs de Galerías en Postman](https://www.postman.com/descent-module-candidate-42493728/workspace/adrian-s-workspace/collection/37496489-75258482-9a10-4096-998f-455d44ddaf5e?action=share&creator=37496489)

**📮 Colección de Postman (Imágenes):** [Probar APIs de Imágenes en Postman](https://www.postman.com/descent-module-candidate-42493728/workspace/adrian-s-workspace/collection/37496489-289a7a84-e3c0-499a-93b4-33bd5640a9be?action=share&creator=37496489)

### Galerías

- **POST** `/api/galleries` - Crear galería
  - Body: `{ "name": "Mi Galería" }`
- **GET** `/api/galleries` - Listar galerías (con paginación)
  - Query params: `?page=1&limit=10`
- **GET** `/api/galleries/:id` - Obtener galería con sus imágenes
- **PUT** `/api/galleries/:id` - Actualizar galería
  - Body: `{ "name": "Nuevo Nombre" }`
- **DELETE** `/api/galleries/:id` - Eliminar galería (elimina imágenes en cascada)

### Imágenes

- **POST** `/api/images/:galleryId` - Subir imagen a galería
  - Content-Type: `multipart/form-data`
  - Fields: `image` (file, requerido), `name` (opcional), `description` (opcional), `customUrl` (opcional)
  - Si no se proporcionan name, description o customUrl, se generan automáticamente
- **GET** `/api/images/:galleryId` - Listar imágenes de una galería
- **GET** `/api/images/single/:id` - Obtener imagen específica
- **PUT** `/api/images/:id` - Actualizar imagen
  - Body: `{ "name": "Nuevo Nombre", "description": "Nueva Descripción" }`
- **DELETE** `/api/images/:id` - Eliminar imagen (elimina archivo físico)

### Archivos estáticos

- **GET** `/uploads/:filename` - Acceder a imágenes subidas

## Características 🎁

- ✅ Subida de imágenes (JPEG, JPG, PNG, GIF, WEBP)
- ✅ Límite de tamaño: 5MB por imagen
- ✅ Generación automática de nombres, descripciones y URLs únicas
- ✅ Validación de datos con express-validator
- ✅ Rate limiting (100 requests/15min por IP)
- ✅ Logging estructurado con Winston
- ✅ Manejo centralizado de errores
- ✅ Seguridad con Helmet
- ✅ CORS configurable
- ✅ Paginación en listados
- ✅ Relación 1:N entre galerías e imágenes

## Construido con 🛠️

- [Express](https://expressjs.com/) - Framework web
- [Sequelize](https://sequelize.org/) - ORM para MySQL
- [Multer](https://github.com/expressjs/multer) - Manejo de archivos
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Helmet](https://helmetjs.github.io/) - Seguridad HTTP
- [Express Validator](https://express-validator.github.io/) - Validación de datos
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting

## Modelo de Datos 📊

### Gallery

- `id` (INTEGER, PK, AUTO_INCREMENT)
- `name` (STRING, NOT NULL)
- `createdAt` (DATE)
- `updatedAt` (DATE)

### Image

- `id` (INTEGER, PK, AUTO_INCREMENT)
- `name` (STRING, NOT NULL)
- `description` (TEXT)
- `customUrl` (STRING, UNIQUE, NOT NULL)
- `imageFile` (STRING, NOT NULL)
- `galleryId` (INTEGER, FK → Gallery.id)
- `createdAt` (DATE)
- `updatedAt` (DATE)

## Scripts disponibles 📌

```bash
npm start       # Inicia el servidor en modo producción
npm run dev     # Inicia el servidor con nodemon (auto-reload)
```

## Seguridad 🔐

- Variables de entorno protegidas (`.env` en `.gitignore`)
- Helmet para headers HTTP seguros
- Rate limiting para prevenir ataques
- Validación de tipos de archivo
- Validación de datos de entrada
- Manejo seguro de errores

---

# Galería de Imágenes - Frontend

Aplicación móvil/web para gestión de galerías de imágenes con diseño futurista, construida con Ionic + Angular.

## Comenzando 🚀

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### Pre-requisitos 📋

Necesitas tener instalado lo siguiente:

```
Node.js (v14 o superior)
npm (v6 o superior)
Ionic CLI (v7 o superior)
Angular CLI (v15 o superior)
```

Para instalar Ionic CLI globalmente:

```bash
npm install -g @ionic/cli
```

### Instalación 🔧

Sigue estos pasos para configurar el entorno de desarrollo:

**1. Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd Gallery App_Ionic_Express_Sequelize/frontend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar conexión con el backend**

Asegúrate de que el backend esté corriendo en `http://localhost:8080`

Los servicios están configurados para conectarse a:

- Galerías: `http://localhost:8080/api/galleries`
- Imágenes: `http://localhost:8080/api/images`

**4. Iniciar la aplicación**

```bash
ionic serve
```

La aplicación estará corriendo en `http://localhost:8100`

## Estructura del Proyecto 🛠️

```
frontend/
├── src/
│   ├── app/
│   │   ├── home/                    # Página principal (lista de galerías)
│   │   ├── gallery-detail/          # Detalle de galería (imágenes)
│   │   ├── services/                # Servicios HTTP
│   │   │   ├── gallery.service.ts   # Servicio de galerías
│   │   │   └── image.service.ts     # Servicio de imágenes
│   │   ├── app-routing.module.ts    # Configuración de rutas
│   │   └── app.module.ts            # Módulo principal
│   ├── assets/                      # Recursos estáticos
│   ├── theme/                       # Temas de Ionic
│   └── global.scss                  # Estilos globales
├── angular.json                     # Configuración de Angular
├── ionic.config.json                # Configuración de Ionic
└── package.json                     # Dependencias del proyecto
```

## Navegación de la Aplicación 📱

### 1. Página de Inicio (Home)

**Ruta:** `/home`

**Funcionalidad:**

- Muestra todas las galerías del usuario en un grid responsive
- Cada tarjeta de galería muestra:
  - Preview de la primera imagen (si existe)
  - Nombre de la galería
  - Contador de imágenes
  - Menú de opciones (tres puntos)

**Acciones disponibles:**

- **Click en galería:** Abre el detalle de la galería
- **Botón FAB (+):** Crea una nueva galería
- **Menú (⋮):**
  - Editar nombre de la galería
  - Eliminar galería (con advertencia de imágenes)

**Estado vacío:**

- Si no hay galerías, muestra un diseño especial invitando a crear la primera galería

### 2. Detalle de Galería

**Ruta:** `/gallery-detail/:id`

**Funcionalidad:**

- Muestra todas las imágenes de la galería en un grid responsive
- Cada imagen muestra:
  - Imagen en miniatura
  - Overlay con nombre y descripción al hover
  - Menú de opciones (tres puntos)

**Acciones disponibles:**

- **Click en imagen:** Abre el visor de imagen a pantalla completa
- **Botón FAB (+):** Sube una nueva imagen
- **Menú (⋮):**
  - Editar nombre y descripción de la imagen
  - Eliminar imagen
- **Botón volver:** Regresa a la página de inicio

**Estado vacío:**

- Si no hay imágenes, muestra un diseño especial invitando a subir la primera imagen

### 3. Visor de Imágenes

**Funcionalidad:**

- Muestra la imagen seleccionada a pantalla completa
- Fondo blanco translúcido para la imagen
- Información de la imagen debajo (nombre y descripción)

**Navegación:**

- **Flechas laterales:** Navega entre imágenes (solo aparecen si hay más imágenes)
  - Flecha izquierda: Imagen anterior
  - Flecha derecha: Imagen siguiente
- **Click fuera de la imagen:** Cierra el visor
- **Botón volver (header):** Cierra el visor y vuelve a la galería

## Características Principales ✨

### Gestión de Galerías

- ✅ Crear galerías con nombre personalizado
- ✅ Editar nombre de galerías existentes
- ✅ Eliminar galerías (elimina imágenes en cascada)
- ✅ Vista previa de la primera imagen
- ✅ Contador de imágenes por galería

### Gestión de Imágenes

- ✅ Subir imágenes (JPEG, JPG, PNG, GIF, WEBP)
- ✅ Límite de tamaño: 5MB por imagen (validación en frontend)
- ✅ Campos opcionales: nombre y descripción
- ✅ Editar nombre y descripción de imágenes
- ✅ Eliminar imágenes individuales
- ✅ Visor de imágenes a pantalla completa
- ✅ Navegación entre imágenes con flechas

### Diseño Futurista 🎨

- **Paleta de colores:**
  - Gradientes: Azul cian (#00d4ff) y púrpura (#7b2ff7)
  - Fondo oscuro espacial: #0f0c29 → #302b63 → #24243e
- **Efectos visuales:**
  - Glassmorphism (fondos translúcidos con blur)
  - Animaciones suaves en hover y transiciones
  - Efectos de glow en tarjetas
  - Botones con gradientes vibrantes
- **Responsive:**
  - Grid adaptativo para galerías e imágenes
  - Diseño mobile-first
  - Optimizado para tablets y desktop

### Experiencia de Usuario

- ✅ Estados vacíos informativos y atractivos
- ✅ Confirmaciones antes de eliminar
- ✅ Alertas personalizadas con estilo futurista
- ✅ Menús contextuales (action sheets)
- ✅ Validación de tamaño de archivo
- ✅ Feedback visual en todas las acciones
- ✅ Navegación intuitiva

## Servicios HTTP 🔌

### GalleryService

```typescript
getAll(page, limit); // Obtener todas las galerías con paginación
getOne(id); // Obtener una galería específica con sus imágenes
create(name); // Crear nueva galería
update(id, name); // Actualizar nombre de galería
delete id; // Eliminar galería
```

### ImageService

```typescript
getAll(galleryId); // Obtener todas las imágenes de una galería
create(galleryId, formData); // Subir nueva imagen
update(id, formData); // Actualizar nombre y descripción
delete id; // Eliminar imagen
```

## Flujo de Trabajo del Usuario 👤

### Crear y gestionar galerías:

1. Usuario entra a la aplicación → Ve página de inicio
2. Click en botón FAB (+) → Introduce nombre de galería
3. Galería creada → Aparece en el grid
4. Click en menú (⋮) → Puede editar o eliminar

### Subir y gestionar imágenes:

1. Click en una galería → Entra al detalle
2. Click en botón FAB (+) → Selecciona imagen del dispositivo
3. Introduce nombre y descripción (opcional) → Sube imagen
4. Imagen aparece en el grid
5. Click en menú (⋮) → Puede editar o eliminar

### Ver imágenes:

1. Click en una imagen → Se abre visor a pantalla completa
2. Usa flechas para navegar entre imágenes
3. Click fuera o botón volver → Cierra visor

## Tecnologías Utilizadas 🛠️

- [Ionic Framework](https://ionicframework.com/) - Framework híbrido para apps móviles
- [Angular](https://angular.io/) - Framework web
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje de programación
- [RxJS](https://rxjs.dev/) - Programación reactiva
- [Ionic Components](https://ionicframework.com/docs/components) - Componentes UI nativos
- [SCSS](https://sass-lang.com/) - Preprocesador CSS

## Scripts Disponibles 📌

```bash
ionic serve              # Inicia servidor de desarrollo (http://localhost:8100)
ionic build              # Compila la aplicación para producción
ionic build --prod       # Compila optimizada para producción
ng test                  # Ejecuta tests unitarios
ng lint                  # Ejecuta linter de código
```

## Configuración de Producción 🚀

Para compilar la aplicación para producción:

```bash
ionic build --prod
```

Los archivos compilados estarán en `www/`

## Compatibilidad 📱

- **Navegadores web:** Chrome, Firefox, Safari, Edge (últimas versiones)
- **Dispositivos móviles:** iOS 11+, Android 5.0+
- **Tablets:** iPad, Android tablets
- **Desktop:** Windows, macOS, Linux

## Características de Seguridad 🔐

- Validación de tipos de archivo en frontend
- Validación de tamaño de archivo (5MB máximo)
- Sanitización de inputs
- Manejo seguro de errores HTTP
- CORS configurado en backend

## Mejoras Futuras 🔮

- [ ] Autenticación de usuarios
- [ ] Compartir galerías entre usuarios
- [ ] Filtros y búsqueda de imágenes
- [ ] Ordenar imágenes por drag & drop
- [ ] Zoom en visor de imágenes
- [ ] Descargar imágenes
- [ ] Modo offline con almacenamiento local
- [ ] Temas personalizables (claro/oscuro)

## Solución de Problemas 🔧

### La aplicación no se conecta al backend

- Verifica que el backend esté corriendo en `http://localhost:8080`
- Revisa la consola del navegador para errores CORS
- Asegúrate de que el backend tenga configurado CORS correctamente

### Las imágenes no se cargan

- Verifica que el backend tenga configurado Helmet con `crossOriginResourcePolicy: "cross-origin"`
- Revisa que la carpeta `uploads/` exista en el backend
- Comprueba los permisos de la carpeta `uploads/`

### Error al subir imágenes

- Verifica que la imagen sea menor a 5MB
- Comprueba que el formato sea válido (JPEG, JPG, PNG, GIF, WEBP)
- Revisa la consola del navegador para errores específicos

## Autor ✒️

- **Adrian Martin Velarde** - _3º DAM_
