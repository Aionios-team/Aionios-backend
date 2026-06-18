# TEST PLAN — Aionios
## Plataforma de Reserva de Citas y Servicios

| Campo | Detalle |
|---|---|
| **Versión** | 1.0 |
| **Fecha** | 2026-06-18 |
| **Estado** | Aprobado |
| **QA Lead** | Sergio Ernesto Rosas Ducoing |
| **Equipo** | Sergio Ernesto Rosas Ducoing · Abraham Rodriguez Contreras · Héctor Javier Adrian Zaragoza |

---

## 1. Introducción y Objetivos

### 1.1 Descripción del Sistema

Aionios es una plataforma web que conecta clientes con negocios de servicios locales (barberías, salones, consultorios, etc.). Permite a los clientes buscar negocios, solicitar citas, realizar pagos en línea y dejar reseñas. Los dueños de negocios gestionan su catálogo de servicios, horarios, solicitudes entrantes y staff. Un panel de administración centraliza la supervisión de toda la plataforma.

**Stack tecnológico:**

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 (TypeScript, React) |
| Backend | NestJS 11 (TypeScript) |
| BD Relacional | PostgreSQL vía Prisma ORM |
| BD NoSQL | MongoDB vía Mongoose |
| Autenticación | JWT (HS256) + bcryptjs |
| Pagos | Stripe |
| Testing Backend | Jest 30 + Supertest |
| Testing E2E | Playwright (por configurar) |
| Testing Rendimiento | k6 (por configurar) |

### 1.2 Objetivos del Plan de Prueba

1. Garantizar que los flujos críticos de negocio (registro, login, solicitud de cita, pago) funcionen correctamente en todos los entornos.
2. Verificar la integridad de los datos entre PostgreSQL y MongoDB ante operaciones concurrentes.
3. Validar que el sistema de autorización por roles (Admin, Dueño, Staff, Cliente) no permita accesos indebidos entre usuarios.
4. Establecer una cobertura mínima del **75%** en el backend antes del despliegue a producción.
5. Documentar y rastrear todos los defectos encontrados hasta su cierre verificado.

---

## 2. Alcance

### 2.1 En Alcance

| Módulo | Componentes incluidos |
|---|---|
| **Autenticación** | Registro, Login, validación de JWT, guard de roles |
| **Usuarios** | CRUD de usuarios y roles |
| **Negocios** | Creación y gestión de negocios, catálogo de servicios |
| **Solicitudes (Citas)** | Crear, confirmar, cancelar; mensajería en MongoDB |
| **Pagos** | Creación, actualización de estado, webhook de Stripe |
| **Horarios** | Gestión de disponibilidad de negocios |
| **Reseñas** | Crear y consultar reseñas de servicios |
| **Notificaciones** | Creación y lectura de notificaciones (MongoDB) |
| **Tickets de Soporte** | Apertura y gestión de tickets |
| **Activity Logs** | Registro de operaciones críticas |
| **Frontend** | Flujos completos desde el navegador (E2E) |

### 2.2 Fuera de Alcance

- Pruebas de infraestructura cloud (AWS/GCP/Azure) — responsabilidad de DevOps externo.
- Pruebas de compatibilidad con versiones anteriores de Node.js (< 20).
- Pruebas de localización en idiomas distintos al español.
- Integración con pasarelas de pago distintas a Stripe.
- Pruebas de la app móvil (no existe en este alcance).

---

## 3. Estrategia de Prueba por Capa

La estrategia sigue la pirámide de testing: mayor cantidad de pruebas en la base (unitarias) y menor cantidad en la cima (E2E), balanceando velocidad de ejecución con cobertura de riesgo.

```
          /─────────────────\
         /   E2E (Playwright) \        ← Flujos completos usuario final
        /─────────────────────\
       /   Performance (k6)    \       ← Load, Stress, Spike, Soak
      /───────────────────────\
     /   Security (OWASP ZAP)  \      ← OWASP Top 10
    /──────────────────────────\
   /   Integration (Supertest)  \     ← API REST + BD Relacional + MongoDB
  /────────────────────────────\
 /      Unit (Jest + Mocks)     \     ← Servicios, lógica de negocio
/─────────────────────────────────\
```

### Capa 1 — Pruebas Unitarias (Jest)

Prueban cada servicio de NestJS en aislamiento completo. Todas las dependencias externas (PrismaService, JwtService, NotificationsService, Stripe) son mockeadas con `jest.fn()`. Se aplica el patrón **Arrange-Act-Assert** de forma explícita.

**Prioridad de módulos:**

| Prioridad | Módulo | Justificación |
|---|---|---|
| Alta | `AuthService` | Punto de entrada crítico; gestiona tokens y contraseñas |
| Alta | `UsersService` | Base de todos los flujos; validación de unicidad de email |
| Alta | `RequestsService` | Core del negocio; orquesta notificaciones y citas |
| Media | `PaymentsService` | Integración financiera; manejo de estados complejos |
| Media | `HorariosService` | Lógica de disponibilidad; riesgo de bugs en fechas/horas |
| Baja | `NotificationsService` | Funcionalidad de soporte; menor criticidad |

### Capa 2 — Pruebas de Integración (Supertest)

Prueban los endpoints HTTP completos contra la base de datos real en contenedor Docker (Testcontainers). Verifican el flujo completo: HTTP → Controller → Service → BD → Respuesta HTTP.

**Casos obligatorios por endpoint:**
- Happy path con código de status correcto (200/201/204)
- Autenticación requerida → 401 sin token
- Autorización por rol → 403 con token insuficiente
- Validación de entrada → 400 con campos faltantes
- Recurso inexistente → 404

### Capa 3 — Pruebas End-to-End (Playwright)

Automatizan flujos completos desde el navegador sobre el frontend (Next.js). Se ejecutan contra el entorno de staging. Usan `data-testid` como selectores únicos.

**Flujos críticos obligatorios:**
1. Registro de cliente nuevo
2. Login / Logout con credenciales válidas e inválidas
3. Búsqueda de negocio y solicitud de cita
4. Panel de negocio: confirmar/cancelar cita
5. Flujo de pago con Stripe (modo test)
6. Admin: gestión de usuarios y negocios

### Capa 4 — Pruebas de Rendimiento (k6)

Miden el comportamiento bajo carga de los endpoints más solicitados: `POST /auth/login`, `GET /business`, `POST /requests`, `GET /services`.

### Capa 5 — Pruebas de Seguridad (OWASP)

Verificación manual y automatizada contra el OWASP Top 10. OWASP ZAP en modo activo sobre staging; Snyk en el pipeline de CI.

---

## 4. Tipos de Prueba a Ejecutar y Justificación

| Tipo | Herramienta | Justificación |
|---|---|---|
| **Unitarias** | Jest + jest.fn() | Validar lógica de negocio en aislamiento; ejecución en < 10s; detecta regresiones en cada PR |
| **Integración API** | Supertest | Valida contratos HTTP reales sin depender del frontend; detecta problemas de serialización y guards |
| **Integración BD Relacional** | Jest + Prisma (BD test) | Verifica constraints de PostgreSQL (UNIQUE, FK, NOT NULL) que solo se detectan con BD real |
| **Integración BD NoSQL** | Jest + mongodb-memory-server | Valida schemas de Mongoose y pipelines de agregación de notificaciones/mensajes |
| **E2E** | Playwright | Garantiza que el usuario final puede completar sus flujos críticos tras cada despliegue |
| **Rendimiento** | k6 | Identifica el punto de quiebre antes de producción; detecta memory leaks en soak test |
| **Seguridad** | OWASP ZAP + Snyk | Cumplimiento regulatorio; protege datos de clientes y transacciones financieras |
| **Accesibilidad** | axe-core + Lighthouse | Cumplimiento WCAG 2.1 nivel AA para usuarios con discapacidades |

---

## 5. Criterios de Entrada

Las pruebas de cada capa **no inician** hasta que se cumplen todos los criterios de esa capa:

### Pruebas Unitarias
- [x] El módulo a probar compila sin errores de TypeScript (`tsc --noEmit`)
- [x] Las dependencias del módulo están completamente definidas (interfaces/tipos)
- [x] El servicio tiene al menos un método con lógica de negocio (no solo delegación al ORM)

### Pruebas de Integración
- [ ] El entorno local levanta correctamente (`docker-compose up`)
- [ ] Las migraciones de Prisma están al día (`prisma migrate dev` sin errores)
- [ ] Los schemas de Mongoose están sincronizados con MongoDB
- [ ] La colección de Postman/Insomnia del módulo a probar existe y está actualizada

### Pruebas E2E
- [ ] El entorno de staging está desplegado y accesible
- [ ] Los datos semilla (seeders) están cargados en staging
- [ ] Los `data-testid` necesarios están presentes en los componentes frontend
- [ ] Playwright está instalado y configurado (`npx playwright install`)

### Pruebas de Rendimiento
- [ ] El entorno de staging soporta carga similar a producción (mismas specs de servidor)
- [ ] k6 está instalado localmente o en el servidor de CI
- [ ] Los endpoints objetivo están documentados con sus parámetros de carga esperados

### Pruebas de Seguridad
- [ ] El entorno de staging está aislado de producción (datos de prueba, no reales)
- [ ] OWASP ZAP está configurado con el target correcto (URL de staging)
- [ ] Snyk está autenticado en el pipeline de CI

---

## 6. Criterios de Salida

El software se considera **listo para producción** cuando se cumplen **todos** los siguientes criterios:

| Criterio | Métrica objetivo | Herramienta de medición |
|---|---|---|
| Cobertura global del backend | ≥ 75% | `jest --coverage` |
| Cobertura capa de dominio/servicios | ≥ 80% | `jest --coverage` |
| Pruebas unitarias pasando | 100% (0 fallos) | Jest |
| Pruebas de integración API pasando | 100% (0 fallos) | Supertest |
| Pruebas E2E flujos críticos pasando | 100% (0 fallos) | Playwright |
| Defectos abiertos de severidad Critical | 0 | Registro de defectos |
| Defectos abiertos de severidad High | 0 | Registro de defectos |
| Tiempo de respuesta P95 en Load Test | < 500ms | k6 |
| Tasa de errores en Load Test | < 1% | k6 |
| Vulnerabilidades OWASP críticas/altas | 0 sin resolver | OWASP ZAP / Snyk |
| Score Lighthouse Accesibilidad | ≥ 90 | Lighthouse CI |

---

## 7. Criterios de Suspensión

Las pruebas se **pausan temporalmente** si ocurre cualquiera de los siguientes eventos:

| Condición de suspensión | Responsable de resolución | Tiempo máximo de pausa |
|---|---|---|
| El entorno de prueba (staging/local) no levanta o está inestable | Sergio (DevOps) | 4 horas |
| Se detecta un defecto Critical que bloquea más del 30% de los casos de prueba | Abraham (Dev) | Hasta resolución del bug |
| Las migraciones de base de datos fallan o corrompen datos de test | Abraham (Dev) | Hasta restauración del entorno |
| El servicio de Stripe en modo test no responde | Equipo | Hasta que Stripe restablezca el servicio |
| Más del 20% de los tests E2E fallan por razones de infraestructura (no bugs) | Héctor (QA) | Hasta estabilización del entorno |

**Reanudación:** el QA Lead verifica que la condición de suspensión se resolvió antes de reanudar. Se documenta en el registro de defectos el tiempo perdido y la causa.

---

## 8. Roles y Responsabilidades del Equipo de QA

| Rol | Miembro | Responsabilidades |
|---|---|---|
| **QA Lead / Dev** | Sergio Ernesto Rosas Ducoing | Aprobación del Test Plan · Configuración de entornos · Pipeline CI/CD · Pruebas de rendimiento (k6) · Pruebas de seguridad · Corrección de tsconfig · Logging estructurado |
| **Developer / QA** | Abraham Rodriguez Contreras | Pruebas unitarias de todos los servicios · Pruebas de integración API (Supertest) · Pruebas de BD Relacional y NoSQL · Corrección de bugs detectados |
| **QA / Frontend** | Héctor Javier Adrian Zaragoza | Pruebas E2E (Playwright) · Accesibilidad (WCAG 2.1) · Compatibilidad de navegadores · Casos de Prueba (documento) · Registro de Defectos (template) |

**Proceso de revisión:** los Pull Requests que afecten módulos con pruebas requieren que al menos un miembro distinto al autor revise y apruebe los tests antes del merge.

---

## 9. Entornos de Prueba

| Entorno | Propósito | BD Relacional | BD NoSQL | URL / Acceso |
|---|---|---|---|---|
| **Local (dev)** | Desarrollo diario y ejecución de unit tests | PostgreSQL en Docker (`localhost:5432`) | MongoDB en Docker (`localhost:27017`) | `http://localhost:3000` (backend) · `http://localhost:3001` (frontend) |
| **Test (CI)** | Ejecución automática en cada PR | PostgreSQL en Testcontainers (efímero) | mongodb-memory-server (efímero) | GitHub Actions runner (sin URL fija) |
| **Staging** | Pruebas de integración E2E y rendimiento | PostgreSQL en servidor dedicado (datos semilla) | MongoDB Atlas (cluster de staging) | URL de staging (variable de entorno `STAGING_URL`) |
| **Producción** | Monitoreo post-despliegue únicamente | PostgreSQL en servidor de producción | MongoDB Atlas (cluster de producción) | URL de producción (acceso restringido) |

### Diferencias entre entornos

| Aspecto | Local/CI | Staging | Producción |
|---|---|---|---|
| Datos | Fixtures/seeds deterministas | Datos semilla representativos | Datos reales de usuarios |
| Stripe | Modo test (`sk_test_...`) | Modo test (`sk_test_...`) | Modo live (`sk_live_...`) |
| JWT Secret | Variable de entorno `.env.test` | Variable de entorno de staging | Secret Manager |
| Logs | Console (desarrollo) | JSON estructurado (Winston) | JSON estructurado + rotación |
| CORS | Permisivo (`localhost`) | Restrictivo (dominio de staging) | Restrictivo (dominio de producción) |

---

## 10. Herramientas Utilizadas con Justificación

| Herramienta | Versión | Uso | Justificación |
|---|---|---|---|
| **Jest** | 30.x | Unit tests + Integration tests (backend) | Ya instalado en el proyecto; integración nativa con NestJS Testing Module; excelente soporte para mocks y espías |
| **Supertest** | 7.x | Pruebas HTTP de API REST | Ya instalado; permite levantar el servidor NestJS en memoria sin puerto real; mantiene estado de cookies/headers |
| **mongodb-memory-server** | latest | BD NoSQL en memoria para tests | Sin dependencia de Docker en CI; base de datos real de MongoDB limpia por test |
| **Playwright** | latest | Pruebas E2E en el navegador | Multi-browser nativo (Chromium, Firefox, Safari); API más moderna que Cypress; mejor soporte para Next.js |
| **k6** | latest | Pruebas de rendimiento | Scripting en JavaScript; métricas precisas (P95, P99); soporte para Load/Stress/Spike/Soak en un mismo framework |
| **OWASP ZAP** | latest | Escaneo de seguridad automatizado | Estándar de la industria para detección de OWASP Top 10; modo daemon para integración con CI |
| **Snyk** | latest | Análisis de dependencias vulnerables | Integración directa con npm; alertas de CVE en el pipeline de CI |
| **axe-core** | latest | Pruebas de accesibilidad | Librería estándar; integrable con Playwright para validar WCAG 2.1 automáticamente |
| **Lighthouse CI** | latest | Auditoría de accesibilidad y rendimiento frontend | Reportes reproducibles de Lighthouse en cada PR |
| **Winston** | 3.x | Logging estructurado en JSON | Ampliamente usado en el ecosistema Node.js/NestJS; soporte para transports (consola, archivo, servicios externos) |

---

## 11. Gestión de Defectos

### 11.1 Flujo del Ciclo de Vida

```
Open → In Progress → Fixed → Verified → Closed
                  ↘ Rejected (no reproducible / no es bug)
                  ↘ Deferred (aceptado, pospuesto a siguiente versión)
```

### 11.2 Matriz de Severidad y Prioridad

| Severidad | Definición | Ejemplos en Aionios |
|---|---|---|
| **Critical** | El sistema no puede operar; no hay workaround | Login falla para todos los usuarios · Pago se cobra pero no se registra en BD |
| **High** | Funcionalidad principal rota; workaround complicado | No se puede crear una solicitud de cita · JWT no expira correctamente |
| **Medium** | Funcionalidad secundaria rota; workaround existe | Las notificaciones no se envían · Filtro de búsqueda retorna resultados incorrectos |
| **Low** | Problema visual o de usabilidad menor | Texto mal alineado · Mensaje de error con typo · Traducciones faltantes |

| Prioridad | Definición |
|---|---|
| **Blocker** | Bloquea el ciclo de pruebas actual; debe resolverse antes de continuar |
| **High** | Debe resolverse en el sprint actual antes del despliegue |
| **Medium** | Debe resolverse antes de la siguiente versión |
| **Low** | Puede resolverse cuando el backlog lo permita |

### 11.3 Campos Obligatorios del Bug Report

```
ID:           BUG-XXX
Título:       [Módulo] Descripción concisa del fallo bajo qué condición
Severidad:    Critical / High / Medium / Low
Prioridad:    Blocker / High / Medium / Low
Estado:       Open
Entorno:      Local / CI / Staging (OS, browser, versión Node)
Versión:      <commit hash o tag>
Asignado a:   <nombre del desarrollador>
Reportado por: <nombre del QA>

Descripción:
  Comportamiento actual: ...
  Comportamiento esperado: ...

Precondiciones:
  - Usuario autenticado como <rol>
  - <cualquier estado previo requerido>

Pasos para reproducir:
  1. ...
  2. ...
  3. ...

Datos de prueba:
  email: test@ejemplo.com
  payload: { ... }

Evidencia:
  - [Captura de pantalla / Video / Log / Respuesta HTTP]

Referencias:
  - Historia de usuario / endpoint afectado
```

### 11.4 SLA de Resolución

| Severidad | Tiempo máximo de resolución |
|---|---|
| Critical | 4 horas |
| High | 24 horas (1 día hábil) |
| Medium | 72 horas (3 días hábiles) |
| Low | Próximo sprint |

---

## 12. Métricas de Calidad Objetivo

### 12.1 Cobertura de Código

| Capa | Objetivo mínimo | Cómo medirlo |
|---|---|---|
| Servicios (lógica de negocio) | 80% | `jest --coverage --collectCoverageFrom="src/**/*.service.ts"` |
| Controllers | 70% | `jest --coverage --collectCoverageFrom="src/**/*.controller.ts"` |
| Guards / Interceptors | 70% | `jest --coverage` |
| Repositorios / Prisma queries | 60% | Tests de integración con BD real |
| **Global del proyecto** | **75%** | `jest --coverage` — reporte en `coverage/lcov-report/index.html` |

### 12.2 Métricas de Defectos

| Métrica | Objetivo | Fórmula |
|---|---|---|
| Densidad de defectos | < 2 defectos por módulo | Total bugs / Módulos probados |
| Tasa de defectos críticos/altos | < 5% del total | (Critical + High) / Total bugs |
| Tasa de reapertura | < 10% | Bugs reabiertos / Bugs cerrados |
| Defectos encontrados en producción | 0 Critical, < 2 High por versión | Monitoreo post-deploy |

### 12.3 Métricas de Rendimiento

| Endpoint | P50 objetivo | P95 objetivo | Tasa de error máxima |
|---|---|---|---|
| `POST /auth/login` | < 200ms | < 400ms | < 0.1% |
| `GET /business` | < 150ms | < 300ms | < 0.1% |
| `POST /requests` | < 300ms | < 500ms | < 0.5% |
| `GET /services` | < 100ms | < 200ms | < 0.1% |
| **Cualquier endpoint** | — | **< 500ms** | **< 1%** |

---

## 13. Riesgos Identificados y Plan de Mitigación

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R-01 | Los tests de integración fallan en CI por diferencias entre BD local y Testcontainers | Media | Alto | Usar la misma versión de PostgreSQL en Docker local y en Testcontainers; documentar la versión en `docker-compose.yml` |
| R-02 | Las pruebas E2E son inestables (flaky) por condiciones de red o timing | Alta | Medio | Configurar retry de máximo 2 intentos en Playwright; usar `waitForResponse` en vez de `sleep`; aislar la BD de staging con seeders deterministas |
| R-03 | La integración con Stripe Webhooks es difícil de probar localmente | Alta | Alto | Usar Stripe CLI (`stripe listen --forward-to`) en entorno local; mockear el webhook en tests unitarios del `PaymentsService` |
| R-04 | Baja cobertura de código en el módulo de Horarios por complejidad de lógica de fechas | Media | Medio | Priorizar unit tests de funciones de cálculo de disponibilidad; usar `jest.setSystemTime()` para control de fechas |
| R-05 | MongoDB Atlas en staging no disponible durante las pruebas | Baja | Alto | Tener una instancia de MongoDB local en Docker como fallback; `mongodb-memory-server` para CI |
| R-06 | Tiempo insuficiente para implementar todos los tipos de prueba antes de la entrega | Alta | Alto | Priorizar Unit > Integration API > E2E > Performance > Security; documentar lo pendiente en el registro de deuda técnica |
| R-07 | Cambios de última hora en la API rompen los tests existentes | Media | Alto | Versionado del API (`/api/v1/`); ejecutar la suite completa antes de cada merge a `main` vía GitHub Actions |
| R-08 | Los datos de prueba en staging se corrompen entre sesiones | Media | Medio | Script de reset de BD de staging antes de cada sesión de pruebas E2E; seeders idempotentes |

---

## Apéndice A — Módulos y Endpoints de la API

| Módulo | Endpoint base | Requiere Auth | Roles permitidos |
|---|---|---|---|
| Auth | `POST /auth/register`, `POST /auth/login` | No | Público |
| Users | `GET/POST/PATCH/DELETE /users` | Sí | Admin |
| Business | `GET/POST/PATCH/DELETE /business` | Sí | Admin, Dueño |
| Services | `GET/POST/PATCH/DELETE /services` | Sí | Admin, Dueño |
| Requests | `GET/POST/PATCH/DELETE /requests` | Sí | Admin, Dueño, Cliente |
| Payments | `GET/POST/PATCH /payments` | Sí | Admin, Dueño |
| Horarios | `GET/POST/PATCH/DELETE /horarios` | Sí | Admin, Dueño |
| Reviews | `GET/POST /reviews` | Sí | Admin, Cliente |
| Notifications | `GET/PATCH /notifications` | Sí | Todos los roles |
| Support Tickets | `GET/POST/PATCH /support-tickets` | Sí | Admin, Dueño, Cliente |
| Activity Logs | `GET /activity-logs` | Sí | Admin |

## Apéndice B — Checklist de Aprobación

| Ítem | Responsable | Estado |
|---|---|---|
| Test Plan revisado y aprobado por el equipo | Sergio (QA Lead) | ✅ Aprobado |
| El plan incluye las cuatro capas: frontend, API, BD relacional, BD NoSQL | Sergio (QA Lead) | ✅ |
| Los criterios de entrada y salida son medibles y específicos | Sergio (QA Lead) | ✅ |
| Entornos de prueba documentados con diferencias entre ellos | Sergio (QA Lead) | ✅ |
| El Test Plan está versionado en el repositorio del proyecto | Equipo | ✅ (este archivo) |
