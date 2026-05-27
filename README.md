# Aionios — Plataforma de Agendamiento de Servicios

Sistema SaaS full-stack para que negocios locales gestionen sus citas, servicios, pagos y reseñas, y para que clientes puedan explorar negocios, agendar y pagar en línea.

---

## Repositorios

| Repositorio | URL |
|---|---|
| **Backend** (NestJS) | https://github.com/Aionios-team/Aionios-backend |
| **Frontend** (Next.js) | https://github.com/Aionios-team/Aionios-frontend |

---

## Arquitectura general

```
┌─────────────────────────────────────────────────────────────┐
│                      Cliente / Navegador                     │
│                   Next.js 16  ·  React 19                    │
│              Tailwind CSS  ·  Axios  ·  JWT                  │
└───────────────────────────┬─────────────────────────────────┘
                            │  HTTP / REST JSON
┌───────────────────────────▼─────────────────────────────────┐
│                    NestJS 11  (API REST)                     │
│         Guards: JwtAuthGuard  ·  RolesGuard                  │
│         Módulos: Auth · Users · Business · Services          │
│           Requests · Payments · Reviews · Horarios           │
│           SupportTickets · Notifications · ActivityLogs      │
└──────────────┬────────────────────────┬─────────────────────┘
               │                        │
┌──────────────▼──────────┐  ┌──────────▼──────────────────┐
│   PostgreSQL  (Neon)     │  │    MongoDB  (Atlas)          │
│   Prisma ORM             │  │    Mongoose ODM              │
│                          │  │                              │
│  · Rol                   │  │  · Service (catálogo)        │
│  · Usuario               │  │  · Review (reseñas)          │
│  · Negocio               │  │  · Horario (agenda/bloqueos) │
│  · Staff                 │  │  · SupportTicket             │
│  · Solicitud (citas)     │  │  · ActivityLog               │
│  · Pago                  │  │  · BusinessUiConfig          │
└──────────────────────────┘  └──────────────────────────────┘
```

### Por qué arquitectura híbrida (PostgreSQL + MongoDB)

- **PostgreSQL** maneja las entidades con relaciones estrictas e integridad referencial crítica: usuarios, citas y pagos deben ser consistentes y auditables.
- **MongoDB** maneja los datos con esquema flexible o de alta variabilidad: el catálogo de servicios varía por negocio, los horarios tienen configuraciones arbitrarias, las reseñas y tickets crecen con arreglos embebidos.

---

## Stack tecnológico

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| NestJS | 11 | Framework principal |
| TypeScript | 5 | Lenguaje |
| Prisma | 7 | ORM → PostgreSQL (Neon) |
| Mongoose | 9 | ODM → MongoDB (Atlas) |
| @nestjs/jwt | 11 | Autenticación JWT |
| bcryptjs | 2 | Hash de contraseñas |
| Stripe SDK | 16 | Webhook de pagos en línea |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16 | Framework (App Router) |
| React | 19 | UI |
| TypeScript | 5 | Lenguaje |
| Tailwind CSS | 4 | Estilos utilitarios |
| Axios | 1 | Cliente HTTP con interceptores |
| Lucide React | — | Íconos |

---

## Estructura de carpetas

### Backend
```
src/
├── auth/                  # Registro, login, JWT strategy
├── users/                 # CRUD de usuarios, roles, PATCH /users/me
├── business/              # Negocios: CRUD, staff, GET /business/mine
├── services/              # Catálogo de servicios por negocio (MongoDB)
├── requests/              # Solicitudes/citas: GET /mine, GET /negocio/:id
├── payments/              # Pagos y webhook de Stripe
├── reviews/               # Reseñas: GET /mine, POST respuesta
├── horarios/              # Agenda semanal y bloqueos (MongoDB)
├── support-tickets/       # Tickets de soporte con historial de mensajes
├── notifications/         # Notificaciones
├── activity-logs/         # Log de actividad por negocio
├── business-ui/           # Config visual por negocio
├── prisma/                # PrismaService (singleton global)
└── common/
    ├── decorators/        # @Public()  @Roles()
    └── guards/            # JwtAuthGuard  RolesGuard
```

### Frontend
```
src/
├── app/
│   ├── (auth)/            # /login  /register
│   ├── (client)/portal/   # Portal del cliente
│   │   ├── page.tsx            # Home con buscador
│   │   ├── explorar/           # Listado + filtros por categoría
│   │   ├── negocio/[id]/       # Detalle + formulario de reserva
│   │   ├── citas/              # Mis citas + pagar + reseñar
│   │   └── perfil/             # Perfil editable
│   └── (dashboard)/       # Dashboard del negocio
│       ├── page.tsx            # Panel principal (KPIs + actividad)
│       ├── business/           # Datos del negocio
│       ├── services/           # Catálogo de servicios (CRUD)
│       ├── requests/           # Gestión de solicitudes
│       ├── horarios/           # Agenda semanal + bloqueos
│       ├── payments/           # Ingresos y pagos
│       ├── reviews/            # Reseñas + respuestas
│       └── support/            # Tickets de soporte
├── context/AuthContext.tsx     # Estado global de auth (JWT)
├── hooks/useMyBusiness.ts      # Hook: negocio del usuario actual
├── lib/axios.ts                # Instancia de Axios con interceptor JWT
├── services/                   # Capa de llamadas a la API
└── types/                      # Interfaces TypeScript compartidas
```

---

## Autenticación

### Flujo
1. `POST /auth/register` o `POST /auth/login` → el servidor devuelve `{ user, token }`
2. El frontend guarda `token` en `localStorage` como `aionios_token`
3. El interceptor de Axios inyecta `Authorization: Bearer <token>` en cada petición
4. `JwtAuthGuard` valida el token en cada endpoint protegido
5. `RolesGuard` verifica que el rol del usuario esté en la lista `@Roles(...)` del endpoint
6. Al cerrar sesión se limpia `localStorage` y se redirige a `/login`

### Roles

| id_rol | Nombre | Acceso |
|---|---|---|
| 1 | super administrador | Acceso completo a todo |
| 2 | administrador de negocio | Dashboard completo de su negocio |
| 3 | staff del negocio | Vista de citas y agenda |
| 4 | cliente | Portal: explorar, agendar, pagar, reseñar |

Los endpoints marcados con `@Public()` no requieren token: `POST /auth/login`, `POST /auth/register`, `GET /business`.

---

## Variables de entorno

### Backend — archivo `.env`
```env
# Base de datos relacional (PostgreSQL en Neon)
DATABASE_URL="postgresql://usuario:password@host/nombre_db?sslmode=require"

# Base de datos documental (MongoDB Atlas)
MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/aionios"

# JWT
JWT_SECRET="clave_secreta_minimo_32_caracteres"
JWT_EXPIRES_IN="7d"

# Stripe (pagos en línea — opcional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Frontend — archivo `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Instalación y ejecución local

### Prerrequisitos
- Node.js ≥ 18
- npm ≥ 9
- Credenciales de PostgreSQL (Neon) y MongoDB (Atlas), o instancias locales

### 1. Backend

```bash
git clone https://github.com/Aionios-team/Aionios-backend.git
cd Aionios-backend

npm install

# Crear y completar .env con las variables descritas arriba
cp .env.example .env

# Aplicar el esquema de Prisma a la base de datos
npx prisma db push

# Iniciar en modo desarrollo (hot reload)
npm run start:dev
# API disponible en http://localhost:3001
```

### 2. Frontend

```bash
git clone https://github.com/Aionios-team/Aionios-frontend.git
cd Aionios-frontend

npm install

# Crear .env.local
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > .env.local

# Iniciar en modo desarrollo
npm run dev
# Aplicación disponible en http://localhost:3000
```

---

## API — Referencia de endpoints

Base URL: `http://localhost:3001`  
Todos los endpoints (salvo `@Public`) requieren header: `Authorization: Bearer <token>`

### Autenticación
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario (`id_rol`: 2=negocio, 4=cliente) |
| POST | `/auth/login` | No | Login. Devuelve `{ user, token }` |

### Usuarios
| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| PATCH | `/users/me` | Todos | Editar nombre, apellido, teléfono |
| GET | `/users` | super admin | Listar todos los usuarios |
| PATCH | `/users/:id` | super admin | Editar cualquier usuario |

### Negocios
| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/business` | No | Listar negocios (portal público) |
| GET | `/business/mine` | Autenticado | Negocio del usuario actual |
| GET | `/business/:id` | Autenticado | Detalle de un negocio |
| POST | `/business` | admin negocio | Crear negocio |
| PATCH | `/business/:id` | admin negocio | Actualizar negocio |
| POST | `/business/:id/staff` | admin negocio | Asignar staff |

### Servicios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/services/negocio/:id` | Servicios de un negocio |
| GET | `/services/:id` | Detalle de un servicio |
| POST | `/services` | Crear servicio |
| PATCH | `/services/:id` | Editar servicio |
| DELETE | `/services/:id` | Eliminar servicio |

### Solicitudes / Citas
| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| POST | `/requests` | cliente | Crear solicitud de cita |
| GET | `/requests/mine` | cliente | Mis citas (con negocio y pagos) |
| GET | `/requests/negocio/:id` | admin/staff | Todas las citas del negocio |
| PATCH | `/requests/:id` | admin/staff | Confirmar o cancelar (`{ estado }`) |
| DELETE | `/requests/:id` | admin/staff | Eliminar solicitud |

### Pagos
| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| POST | `/payments` | cliente | Registrar pago (`id_cita`, `monto`, `metodo_pago`) |
| GET | `/payments/negocio/:id` | admin negocio | Pagos recibidos por el negocio |
| PATCH | `/payments/:id` | admin negocio | Actualizar estado de pago |
| POST | `/payments/webhook/stripe` | No | Webhook de Stripe |

### Reseñas
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/reviews/mine` | Mis reseñas como cliente |
| GET | `/reviews/negocio/:id` | Reseñas de un negocio |
| POST | `/reviews` | Crear reseña (`negocio_id`, `rating`, `comentario`) |
| POST | `/reviews/:id/respuesta` | Respuesta del negocio a la reseña |
| DELETE | `/reviews/:id` | Eliminar reseña |

### Horarios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/horarios/negocio/:id` | Horario y bloques de un negocio |
| POST | `/horarios/negocio/:id/bloqueo` | Agregar bloqueo de horario |
| DELETE | `/horarios/negocio/:id/bloqueo/:index` | Eliminar bloqueo por índice |

### Soporte
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/support-tickets/mine` | Tickets del usuario autenticado |
| POST | `/support-tickets` | Crear ticket (`asunto`, `categoria`, `prioridad`) |
| POST | `/support-tickets/:id/mensaje` | Agregar mensaje al hilo |
| PATCH | `/support-tickets/:id` | Cambiar estado (`abierto`/`en_proceso`/`resuelto`) |

---

## Flujos de uso

### Cliente
```
Registro (/register, id_rol=4)
  → Explorar negocios (/portal/explorar)
  → Ver detalle + seleccionar servicio, fecha y hora (/portal/negocio/:id)
  → Confirmar reserva → cita creada en estado PENDIENTE
  → El negocio confirma → estado pasa a CONFIRMADA
  → Cliente paga desde /portal/citas → pago registrado como COMPLETADO
  → Tras la cita, cliente deja reseña con 1–5 estrellas
```

### Administrador de negocio
```
Registro (/register, id_rol=2)
  → Crear negocio (/dashboard/business)
  → Agregar servicios con precio y duración (/dashboard/services)
  → Configurar horario semanal y bloqueos (/dashboard/horarios)
  → Revisar solicitudes entrantes y confirmar/cancelar (/dashboard/requests)
  → Ver ingresos y pagos (/dashboard/payments)
  → Responder reseñas (/dashboard/reviews)
  → Atender tickets de soporte (/dashboard/support)
```

---

## Modelo de datos

### PostgreSQL

```
Rol ──< Usuario >── Negocio ──< Staff
                       │
                   Solicitud ──< Pago
```

### MongoDB (colecciones)

| Colección | Campos principales |
|---|---|
| `services` | `negocio_id`, `nombre`, `descripcion`, `precio`, `duracionMinutos` |
| `reviews` | `negocio_id`, `usuario_id`, `nombre_cliente`, `rating`, `comentario`, `respuesta` |
| `horarios` | `negocio_id`, `configuracion_semanal {}`, `excepciones_y_festivos []` |
| `supporttickets` | `usuario_id`, `asunto`, `categoria`, `prioridad`, `estado`, `mensajes []` |
| `activitylogs` | `negocio_id`, `tipo`, `descripcion`, `fecha` |
| `businessuiconfigs` | `negocio_id`, config visual personalizada |

---

## Cuentas de prueba

Crear cuentas desde `/register`. El campo `id_rol` define el tipo de usuario:

| Tipo | id_rol | Ruta de acceso |
|---|---|---|
| Administrador de negocio | 2 | `/dashboard` |
| Cliente | 4 | `/portal` |

> Al iniciar sesión, el sistema redirige automáticamente al área correspondiente según el rol.
