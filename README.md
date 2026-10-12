# 📚 La Biblioteca de Álvaro

Plataforma web interactiva y editorial para catalogar, explorar, leer y compartir una
biblioteca personal. No usa base de datos externa: **indexa directamente la carpeta de
Google Drive sincronizada** y genera un catálogo estático (`catalog.json`).

- **Origen de libros:** `G:\Mi unidad\libros`
- **Proyecto y datos:** `G:\Mi unidad\proyectos\libros`
- **Cuenta de despliegue (Firebase):** `alcocersotilalvaro@gmail.com`

---

## 🧱 Estructura del proyecto

```
libros/
├─ indexer.py               # Módulo 1: escaneo, deduplicación y generación del catálogo
├─ requirements.txt         # Dependencias opcionales del indexador (mejor extracción de metadatos)
├─ drive_map.json.example   # Plantilla para enlazar archivos con Google Drive (visor embebido)
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ firebase.json            # Módulo 4: configuración de Firebase Hosting
├─ .firebaserc
├─ .env.example             # Módulo 3: plantilla de claves EmailJS (copiar a .env)
├─ build-and-deploy.ps1     # Compila en local y publica (evita la limitación de Drive+npm)
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ config/
   │  └─ emailjs.js          # Módulo 3: configuración de notificaciones por email
   ├─ data/
   │  └─ catalog.json        # ← Generado por indexer.py
   ├─ utils/
   │  └─ cover.js
   └─ components/            # Módulo 2: interfaz React + Tailwind
      ├─ Header.jsx  ThemeToggle.jsx  SearchBar.jsx  FilterBar.jsx
      ├─ BookGrid.jsx  BookCard.jsx  BookModal.jsx
      ├─ ShareButtons.jsx  Comments.jsx
      ├─ AboutMe.jsx  Footer.jsx  Icons.jsx
```

---

## ✅ Requisitos previos

- **Python 3.9+** (para el indexador)
- **Node.js 18+** y **npm** (para la web)
- **Firebase CLI** (para el despliegue): `npm install -g firebase-tools`

---

## 1️⃣ Módulo 1 — Indexar y limpiar la biblioteca

El script `indexer.py`:

- Recorre `G:\Mi unidad\libros` (PDF, EPUB, MOBI).
- **Duplicados idénticos** (mismo título + misma edición): conserva el **más reciente**
  y elimina el más antiguo.
- **Misma obra, edición distinta**: **conserva ambas**, las marca con distintivo de
  "múltiples ediciones" y genera una **reseña comparativa** básica.
- Extrae metadatos (título, autor, edición, año) y **clasifica por tema** según la
  carpeta de origen.
- Genera `src/data/catalog.json`.

### Instalar dependencias opcionales (recomendado)

Mejoran la lectura de metadatos incrustados. El script también funciona sin ellas
(usando el nombre del archivo).

```powershell
pip install -r requirements.txt
```

### Primera ejecución — SIMULACIÓN (no borra nada)

> Por seguridad, el borrado de duplicados está **desactivado** por defecto. Primero revisa
> qué se eliminaría.

```powershell
python indexer.py
```

Verás en la consola qué duplicados **se borrarían** y se generará el `catalog.json`.

### Aplicar el borrado real de duplicados antiguos

Cuando estés conforme con la simulación:

```powershell
python indexer.py --delete
```

> ⚠️ `--delete` elimina de forma permanente los archivos duplicados **más antiguos** de
> `G:\Mi unidad\libros`. Las ediciones diferentes **nunca** se borran.

Opciones útiles:

```powershell
python indexer.py --books "G:\Mi unidad\libros"   # ruta personalizada
```

---

## 🔗 Visor de lectura con Google Drive

Como la web se aloja en Firebase, los PDF no se suben; se leen desde Google Drive con el
visor embebido. Cada libro necesita su **ID de Google Drive** en `drive_map.json`.

### Opción A (recomendada) — Automático con `drive_map_local.py`

Si usas **Google Drive para Escritorio** (unidad `G:`), esta es la vía más fiable: lee los
IDs directamente de la base de datos local de Drive, **sin OAuth ni configurar credenciales**,
y autodetecta la cuenta dueña de la biblioteca aunque tengas varias cuentas conectadas.

```powershell
# Genera drive_map.json emparejando cada libro local con su ID de Drive.
python drive_map_local.py

# (opcional) indica otra carpeta de libros:
python drive_map_local.py --books "G:\Mi unidad\libros"

# Luego regenera el catálogo y despliega:
python indexer.py
powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy
```

Para que el visor cargue también para visitantes públicos, comparte la **carpeta** `libros`
una sola vez en [drive.google.com](https://drive.google.com): clic derecho → **Compartir** →
*Acceso general* → **Cualquiera con el enlace** → **Lector**. Los archivos heredan el permiso.

### Opción B — Automático con la API (`drive_sync.py`)

Obtiene los IDs de **todos** los libros de una vez usando la API de Google Drive.

**Configuración de credenciales (una sola vez):**

1. Ve a [Google Cloud Console](https://console.cloud.google.com) y selecciona tu proyecto
   (`libros-variados`).
2. **APIs y servicios → Biblioteca** → busca **Google Drive API** → **Habilitar**.
3. **APIs y servicios → Pantalla de consentimiento OAuth**: tipo **Externo**, ponle un
   nombre, tu correo de asistencia, y en *Usuarios de prueba* añade
   `alcocersotilalvaro@gmail.com`.
4. **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth** →
   tipo de aplicación **Aplicación de escritorio** → **Crear**.
5. **Descarga el JSON** y guárdalo en la raíz del proyecto como **`drive_credentials.json`**.

**Ejecutar la sincronización:**

```powershell
pip install -r requirements.txt

# Genera drive_map.json (busca la carpeta "libros" en tu Drive).
# La primera vez se abrirá el navegador para autorizar.
python drive_sync.py

# Para que el visor funcione también para visitantes públicos,
# comparte cada archivo como "cualquiera con el enlace (lector)":
python drive_sync.py --share

# Si tu carpeta no se llama "libros" o hay varias, usa el ID de la carpeta:
python drive_sync.py --folder-id <ID_DE_LA_CARPETA> --share

# Luego regenera el catálogo y despliega:
python indexer.py
powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy
```

> `drive_credentials.json` y `token.json` están en `.gitignore`; no se suben al repo.

### Opción C — Manual (uno o pocos libros)

1. En [drive.google.com](https://drive.google.com), comparte el archivo como
   **"Cualquier persona con el enlace"**.
2. Copia el ID del enlace: `https://drive.google.com/file/d/`**`<ID>`**`/view`.
3. Copia `drive_map.json.example` a `drive_map.json` y añade `"ruta/archivo.pdf": "<ID>"`.
4. Vuelve a ejecutar `python indexer.py`.

Los libros con ID se podrán **leer dentro de la web**; los que no, muestran un aviso.

---

## 2️⃣ Módulo 2 — Ejecutar la web en local

> ⚠️ **Importante (Google Drive + npm):** el sistema de archivos virtual de Google Drive
> (`G:`) **no permite** ejecutar `npm install` ni `npm run build` de forma fiable (produce
> errores `EBADF`/`EPERM` porque Drive bloquea las escrituras de npm). El indexador de
> **Python sí funciona** sin problemas en `G:`.
>
> **Solución (recomendada):** usa el script incluido `build-and-deploy.ps1`, que compila en
> una carpeta local temporal y copia el resultado (`dist/`) de vuelta a `G:`
> automáticamente:
>
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1          # compilar
> powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy  # compilar + publicar
> ```
>
> Alternativa manual: copia el proyecto a un disco local (p. ej. `C:\dev\libros`), o pausa
> la sincronización de Google Drive mientras ejecutas los comandos npm.

### Desarrollo en local

Para el servidor de desarrollo con recarga en caliente, trabaja desde una **copia local**
del proyecto (Drive no lo soporta):

```powershell
npm install
npm run dev
```

Abre la URL que indique Vite (normalmente `http://localhost:5173`).

Características:
- Diseño editorial cálido, tipografías *Playfair Display* / *Merriweather* / *Inter*.
- **Modo claro/oscuro** con persistencia.
- Catálogo en cuadrícula con portadas generadas.
- **Búsqueda en tiempo real** (título, autor, palabra clave) y **filtros por tema**.
- Distintivo visual para libros con **múltiples ediciones**.
- **Visor integrado** (Google Drive) en modal.
- **Compartir** en WhatsApp, X, Facebook, LinkedIn + copiar enlace directo.
- **Comentarios** por libro con **nombre, correo y comentario**, y **notificación automática por email** a `alcocersotilalvaro@gmail.com` cada vez que alguien comenta (vía EmailJS).
- Sección **"Sobre mí"** con enlaces a Goodreads y Mercado Libre.

Para generar el build de producción:

```powershell
# Opción recomendada en Google Drive (compila en local y copia dist a G:):
powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1

# Opción manual (solo si trabajas en un disco local):
npm run build      # genera la carpeta dist/
npm run preview    # (opcional) previsualiza el build
```

---

## 💬 Módulo 3 — Notificaciones de comentarios por email (EmailJS)

Cada libro tiene una caja de comentarios donde el visitante deja **nombre, correo y
comentario**. Al publicar, se envía automáticamente un email a
`alcocersotilalvaro@gmail.com` con el detalle del comentario. Todo esto funciona en
un sitio 100 % estático (sin servidor) usando **EmailJS** (plan gratuito).

Los comentarios además se guardan en el navegador del visitante (`localStorage`) para
mostrarse en la ficha del libro.

### Configuración de EmailJS (una sola vez)

1. Crea una cuenta gratuita en <https://www.emailjs.com>.
2. **Email Services** → *Add New Service* → conecta tu Gmail
   (`alcocersotilalvaro@gmail.com`). Copia el **Service ID**.
3. **Email Templates** → *Create New Template*. Configura:
   - **Subject:**
     ```
     💬 Nuevo comentario en tu biblioteca: {{book_title}}
     ```
   - **To Email:** `{{to_email}}`
   - **Content (cuerpo):**
     ```
     Has recibido un nuevo comentario en tu biblioteca.

     👤 Nombre:  {{from_name}}
     ✉️  Correo:  {{from_email}}
     📖 Libro:   {{book_title}} ({{book_edition}})

     💬 Comentario:
     {{comment}}

     🔗 Ver en la web: {{link}}
     ```
   Guarda y copia el **Template ID**.
4. **Account → API Keys** → copia tu **Public Key**.
5. Crea un archivo `.env` en la raíz del proyecto (copia de `.env.example`) con:
   ```env
   VITE_EMAILJS_SERVICE_ID=tu_service_id
   VITE_EMAILJS_TEMPLATE_ID=tu_template_id
   VITE_EMAILJS_PUBLIC_KEY=tu_public_key
   ```

> Si no configuras EmailJS, la web sigue funcionando: los comentarios se guardan en el
> navegador, simplemente no se envía el correo.

### Variables que envía la plantilla

| Variable | Contenido |
|---|---|
| `{{from_name}}` | Nombre del visitante |
| `{{from_email}}` | Correo del visitante |
| `{{book_title}}` | Título del libro comentado |
| `{{book_edition}}` | Edición del libro |
| `{{comment}}` | Texto del comentario |
| `{{link}}` | Enlace directo al libro (`#libro-<id>`) |
| `{{to_email}}` | Destinatario (tu correo) |

---

## 4️⃣ Módulo 4 — Desplegar en Firebase Hosting (gratis)

### Paso a paso

```powershell
# 1. Instala la CLI (una sola vez)
npm install -g firebase-tools

# 2. Inicia sesión con tu cuenta
firebase login
#    -> Usa alcocersotilalvaro@gmail.com en el navegador

# 3. Crea el proyecto en https://console.firebase.google.com
#    (botón "Agregar proyecto"). Anota el Project ID.

# 4. Vincula el Project ID a este repositorio:
#    edita .firebaserc y reemplaza "biblioteca-alvaro" por tu Project ID real,
#    o ejecútalo automáticamente:
firebase use --add
#    -> selecciona tu proyecto y ponle el alias "default"

# 5. (Solo si quieres regenerar la config) inicializa Hosting:
#    firebase init hosting
#      - Public directory:   dist
#      - Single-page app:    Yes
#      - Overwrite index.html: No

# 6. Construye y publica
#    Recomendado en Google Drive (compila en local y despliega):
powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy

#    Alternativa manual (solo en disco local):
#    npm run build
#    firebase deploy --only hosting
```

Al terminar, Firebase te dará la URL pública (`https://<tu-project-id>.web.app`).

### Actualizar el sitio más adelante

```powershell
python indexer.py --delete   # re-indexa (o sin --delete para solo actualizar catálogo)
powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy
```

---

## 🔁 Flujo completo resumido

```powershell
pip install -r requirements.txt      # una vez
python indexer.py                    # revisar duplicados (simulación)
python indexer.py --delete           # aplicar limpieza + generar catálogo
firebase login                       # una vez
powershell -ExecutionPolicy Bypass -File .\build-and-deploy.ps1 -Deploy   # compilar + publicar
```

---

## 💬 Nota sobre comentarios

Los comentarios se guardan en el navegador de cada visitante (`localStorage`) y, al
publicar, se envía una **notificación por email** a tu bandeja (ver *Módulo 3 —
EmailJS* arriba). Si en el futuro quieres comentarios **compartidos entre dispositivos**,
puedes conectar Firebase Firestore (capa gratuita) sustituyendo la lógica de
`src/components/Comments.jsx` por llamadas a Firestore. El resto de la app no cambia.
