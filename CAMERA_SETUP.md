# 📸 Configuración de Cámara - Capacitor Camera

## ✅ Funcionalidad Implementada

La aplicación ahora permite **capturar fotos con la cámara del dispositivo** además de seleccionar imágenes desde la galería.

### Cambios realizados:

1. ✅ Instalado `@capacitor/camera`
2. ✅ Implementado menú de opciones al añadir imagen:
   - **Tomar foto** - Abre la cámara nativa
   - **Seleccionar del dispositivo** - Abre selector de archivos
3. ✅ Conversión automática de foto capturada a File para subir al backend
4. ✅ Documentación actualizada en README.md

---

## 🚀 Cómo Probar en Navegador Web

**⚠️ IMPORTANTE:** En navegador web, la funcionalidad de cámara usará la **cámara web del ordenador** a través de PWA Elements (interfaz simulada). Para probar la funcionalidad completa con cámara nativa del móvil, **debes usar un dispositivo Android/iOS real o emulador**.

### Pasos para probar en navegador:

1. Asegúrate de que el backend esté corriendo:
```bash
cd backend
npm start
```

2. **IMPORTANTE:** Detén el servidor si está corriendo (Ctrl+C) y reinicia:
```bash
cd frontend
ionic serve
```

3. Navega a una galería y haz click en el botón FAB (+)
4. Selecciona "Tomar foto"
5. Se abrirá una interfaz de cámara simulada (PWA Elements)
6. El navegador pedirá permiso para acceder a la cámara web
7. Captura la foto y se subirá automáticamente

**Nota:** Si no tienes cámara web, la opción "Tomar foto" no funcionará correctamente en el navegador. En ese caso, **debes probar en un dispositivo móvil o emulador Android** (ver secciones siguientes).

---

## 📱 Cómo Probar en Android (Recomendado para Entrega)

### Opción 1: Dispositivo Android Real

1. **Compilar la aplicación:**
```bash
cd frontend
ionic build
npx cap add android
npx cap sync
```

2. **Abrir en Android Studio:**
```bash
npx cap open android
```

3. **Conectar tu móvil Android:**
   - Activa "Opciones de desarrollador" en tu móvil
   - Activa "Depuración USB"
   - Conecta el móvil por USB al ordenador

4. **Ejecutar desde Android Studio:**
   - Click en el botón "Run" (▶️)
   - Selecciona tu dispositivo
   - La app se instalará y abrirá automáticamente

5. **Probar la cámara:**
   - Navega a una galería
   - Click en botón FAB (+)
   - Selecciona "Tomar foto"
   - La cámara nativa se abrirá
   - Captura la foto y se guardará en la galería

### Opción 2: Emulador Android (Android Studio)

1. **Compilar la aplicación:**
```bash
cd frontend
ionic build
npx cap add android
npx cap sync
```

2. **Abrir en Android Studio:**
```bash
npx cap open android
```

3. **Crear/Iniciar emulador:**
   - En Android Studio: Tools → Device Manager
   - Crea un nuevo dispositivo virtual (AVD) o usa uno existente
   - Recomendado: Pixel 5 con Android 11+
   - Inicia el emulador

4. **Ejecutar la app:**
   - Click en "Run" (▶️)
   - Selecciona el emulador
   - La app se instalará automáticamente

5. **Probar la cámara:**
   - El emulador tiene una cámara virtual
   - Navega a una galería
   - Click en botón FAB (+)
   - Selecciona "Tomar foto"
   - Usa la cámara virtual del emulador

---

## 🍎 Cómo Probar en iOS (Opcional)

**Requisitos:** macOS con Xcode instalado

1. **Compilar la aplicación:**
```bash
cd frontend
ionic build
npx cap add ios
npx cap sync
```

2. **Abrir en Xcode:**
```bash
npx cap open ios
```

3. **Configurar permisos de cámara:**
   - En Xcode, abre `Info.plist`
   - Añade la clave: `NSCameraUsageDescription`
   - Valor: "Esta app necesita acceso a la cámara para capturar fotos"

4. **Ejecutar en simulador o dispositivo real:**
   - Selecciona un dispositivo/simulador
   - Click en "Run" (▶️)
   - Nota: El simulador de iOS no tiene cámara real, usa dispositivo físico

---

## 📸 Capturas de Pantalla para la Entrega

Para cumplir con el **Apartado 14 (5%)**, necesitas capturar pantallazos mostrando:

1. **Menú de opciones al añadir imagen:**
   - Pantallazo del ActionSheet con "Tomar foto" y "Seleccionar del dispositivo"

2. **Cámara abierta:**
   - Pantallazo de la cámara nativa del móvil/emulador abierta

3. **Foto capturada y guardada:**
   - Pantallazo de la galería mostrando la imagen capturada con la cámara

4. **Detalle de la imagen:**
   - Pantallazo mostrando la imagen capturada en el visor

---

## 🔧 Solución de Problemas

### Error: "Camera not available"
- **Causa:** El dispositivo/emulador no tiene cámara o no tiene permisos
- **Solución:** 
  - En Android: Verifica que el emulador tenga cámara habilitada
  - En dispositivo real: Acepta los permisos de cámara cuando la app los solicite

### Error: "Plugin Camera does not have web implementation"
- **Causa:** Intentando usar en navegador sin permisos
- **Solución:** Acepta los permisos de cámara web en el navegador

### La foto no se sube al backend
- **Causa:** Backend no está corriendo o hay error de CORS
- **Solución:** 
  - Verifica que el backend esté en `http://localhost:8080`
  - Revisa la consola del navegador/logcat para errores

---

## 📝 Código Implementado

### gallery-detail.page.ts

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

async uploadImage() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Añadir imagen',
    buttons: [
      {
        text: 'Tomar foto',
        icon: 'camera',
        handler: () => this.takePhoto()
      },
      {
        text: 'Seleccionar del dispositivo',
        icon: 'images',
        handler: () => this.selectFromDevice()
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close'
      }
    ]
  });
  await actionSheet.present();
}

async takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    const blob = await this.dataUrlToBlob(image.dataUrl!);
    const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    this.showUploadDialog(file);
  } catch (error) {
    console.error('Error taking photo:', error);
  }
}

async dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return await response.blob();
}
```

---

## ✅ Criterio de Calificación Cumplido

**Apartado 14 (5%):** Pantallazo(s) donde se vea que tu App ejecutándose en un móvil o emulador permite capturar una foto con la cámara.

✅ **IMPLEMENTADO** - La aplicación ahora permite capturar fotos con la cámara nativa del dispositivo y guardarlas en las galerías.
