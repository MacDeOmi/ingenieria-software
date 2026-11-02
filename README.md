# Backend REST API con Autenticación JWT y Gestión de Tareas

API REST desarrollada con **Node.js**, **Express** y **MongoDB (Mongoose)**, protegida con autenticación mediante **JSON Web Tokens (JWT)** y contraseñas encriptadas con **bcrypt**. Permite el registro e inicio de sesión de usuarios, y un CRUD completo de tareas con aislamiento de datos por usuario (cada usuario solo puede consultar, modificar y eliminar sus propias tareas).

El diseño sigue una arquitectura modular en capas basada en el patrón MVC y aplicando los **principios de diseño de software SOLID**.

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) (gestor de paquetes de Node)
- Instancia de [MongoDB](https://www.mongodb.com/) (MongoDB Atlas o local)

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo de ejemplo `.env.example` y crea tu propio `.env`:
```bash
cp .env.example .env
```
Configura las variables correspondientes en el archivo `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/<nombre_db>?retryWrites=true&w=majority
NODE_ENV=development
JWT_SECRET=tu_clave_secreta_jwt
```

> **Nota de seguridad:** Nunca compartas ni subas tu archivo `.env` al repositorio de GitHub. Ya se encuentra excluido en `.gitignore`.

### 4. Ejecutar el Servidor

- **Modo desarrollo (con recarga automática mediante nodemon):**
  ```bash
  npm run server
  ```
- **Modo producción:**
  ```bash
  npm start
  ```

El servidor iniciará en el puerto configurado (por defecto `http://localhost:5000`).

---

## 🛣️ Lista de Endpoints de la API

Todas las rutas base están montadas en `/api/users` y `/api/tareas`.

### 👤 Rutas de Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Requiere Token | Código Esperado |
| :--- | :--- | :--- | :---: | :---: |
| **POST** | `/api/users` | Registrar nuevo usuario (`crearUser`) | No | `201 Created` |
| **POST** | `/api/users/login` | Iniciar sesión y obtener token JWT (`loginUser`) | No | `200 OK` |
| **GET** | `/api/users/datos` | Obtener datos del usuario autenticado (`datosUser`) | **Sí** | `200 OK` |

#### Ejemplos de Body para Usuarios:
- **POST `/api/users`**:
  ```json
  {
    "nombre": "Pedro",
    "email": "pedro@test.com",
    "password": "password123"
  }
  ```
- **POST `/api/users/login`**:
  ```json
  {
    "email": "pedro@test.com",
    "password": "password123"
  }
  ```

---

### 📝 Rutas de Tareas (`/api/tareas`)

Todas las rutas de tareas están protegidas por el middleware `protect`. Debe incluirse el encabezado:
`Authorization: Bearer <token_jwt>`

| Método | Endpoint | Descripción | Requiere Token | Código Esperado |
| :--- | :--- | :--- | :---: | :---: |
| **GET** | `/api/tareas` | Listar únicamente las tareas del usuario logueado (`getTareas`) | **Sí** | `200 OK` |
| **POST** | `/api/tareas` | Crear una nueva tarea vinculada al usuario (`createTareas`) | **Sí** | `201 Created` |
| **PUT** | `/api/tareas/:id` | Modificar una tarea propia (`updateTareas`) | **Sí** | `200 OK` |
| **DELETE** | `/api/tareas/:id` | Eliminar una tarea propia (`deleteTareas`) | **Sí** | `200 OK` |

#### Ejemplos de Body para Tareas:
- **POST `/api/tareas`**:
  ```json
  {
    "descripcion": "Estudiar para el examen de Ingeniería de Software"
  }
  ```
- **PUT `/api/tareas/:id`**:
  ```json
  {
    "descripcion": "Estudiar para el examen de Ingeniería de Software (Completado)"
  }
  ```

---

## 🔒 Reglas de Seguridad y Aislamiento de Datos

1. **Autenticación con Bearer Token**: El middleware `protect` intercepta los requests protegidos, valida el JWT con `JWT_SECRET` y extrae el identificador del usuario.
2. **Identidad Confiable**: El ID del usuario se obtiene directamente de `req.user.id` (inyectado desde el token verificado), nunca del cuerpo (`body`) ni de la URL, evitando suplantación.
3. **Aislamiento Multi-usuario**: 
   - `GET /api/tareas` filtra estrictamente por `{ user: req.user.id }`.
   - `PUT` y `DELETE` verifican que `tarea.user.toString() === req.user.id`. Si un usuario intenta modificar o borrar una tarea ajena, el servidor responde con `401 Unauthorized`.

---

## 🧩 Principios SOLID Aplicados

- **S - Single Responsibility Principle (SRP)**:
  - `config/db.js` solo se encarga de la conexión a la base de datos.
  - `models/` únicamente modelan los esquemas de datos.
  - `controllers/` gestionan la lógica de negocio y respuesta HTTP.
  - `middleware/authMiddleware.js` se encarga exclusivamente de verificar tokens de autorización.
  - `middleware/errorMiddleware.js` centraliza el formateo y códigos de error.
- **O - Open/Closed Principle (OCP)**:
  - La arquitectura mediante routers y middlewares de Express permite añadir nuevas rutas o validaciones sin modificar los controladores existentes.
- **L - Liskov Substitution Principle (LSP)**:
  - Todos los middlewares y controladores respetan la firma canónica de Express `(req, res, next)` facilitando su composición.
- **I - Interface Segregation Principle (ISP)**:
  - Rutas públicas y privadas están claramente segregadas; los endpoints públicos no dependen del middleware de autenticación.
- **D - Dependency Inversion Principle (DIP)**:
  - Los módulos dependen de abstracciones y configuraciones desacopladas mediante variables de entorno (`dotenv`).

---

## 🧪 Pruebas en Postman / Insomnia

Para validar el flujo completo de la rúbrica (Pruebas 1 a 20 y Extras):
1. **Registrar a Pedro y Juan** con `POST /api/users`.
2. **Iniciar sesión** con `POST /api/users/login` para Pedro y Juan, guardando sus tokens (`tokenPedro`, `tokenJuan`).
3. **Verificar protección**: Enviar peticiones a `/api/tareas` sin token o con token alterado (esperado `401`).
4. **CRUD de Pedro**: Crear 2 tareas con `tokenPedro`, listarlas y modificar una de ellas.
5. **Aislamiento de Juan**: Con `tokenJuan`, crear 1 tarea, listar (Juan solo ve la suya) e intentar modificar/eliminar una tarea de Pedro (esperado `401`).
6. **Eliminación y comprobación**: Pedro elimina su tarea y verifica que ya no aparezca.

