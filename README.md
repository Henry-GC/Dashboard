# Dashboard AnonymousPC

Dashboard administrativo para AnonymousPC, una plataforma de comercio electrónico especializada en componentes de PC. Construido con Next.js 15, TypeScript y shadcn/ui.

## 🚀 Características

- **Gestión de Productos**: Sistema completo de CRUD para componentes de PC con categorización automática
- **Ensambles de PC**: Creación y gestión de configuraciones completas con selección de componentes
- **Gestión de Órdenes**: Procesamiento y seguimiento de pedidos de clientes
- **Dashboard de Registros**: Métricas y análisis de rendimiento del negocio
- **Asistente Virtual**: Chat integrado con IA para ayuda contextual
- **Interfaz Moderna**: Diseño responsivo con tema claro/oscuro

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilo**: Tailwind CSS + shadcn/ui
- **Validación**: Formik + Yup
- **HTTP Client**: Axios
- **Iconos**: Lucide React
- **Notificaciones**: Sonner
- **Gestión de Estado**: React Context API

## 📋 Prerrequisitos

- Node.js 18.0 o superior
- pnpm (recomendado) — instalar con `npm install -g pnpm`
- Backend API corriendo en el puerto 5000 (configurable)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Henry-GC/Dashboard.git
   cd dashboard
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar archivo de ejemplo
   cp .env.example .env.local
   
   # Editar .env.local con los valores apropiados:
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_CHATBOT_URL=https://rag.anonymouspc.net/chatbot/chat
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   pnpm dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Arquitectura

### Gestión de Estado
- **Local State**: Cada componente maneja sus propios datos mediante llamadas directas al backend
- **No Context API**: Se eliminó el uso de React Context para evitar cargas innecesarias de datos
- **Fetch on Demand**: Los datos se cargan únicamente cuando los componentes los necesitan
- **Optimización**: Mejor rendimiento al evitar re-renders innecesarios

### Patrón de Datos
```typescript
// Cada componente maneja su estado local
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

// Carga de datos al montar el componente
useEffect(() => {
  const fetchData = async () => {
    const response = await axios.get('/adm/products');
    setProducts(response.data || []);
  };
  fetchData();
}, []);
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── dashboard/          # Páginas del dashboard  
│   │   ├── productos/      # Gestión de productos (sin context)
│   │   ├── ensambles/      # Gestión de ensambles (sin context)
│   │   ├── ordenes/        # Gestión de órdenes
│   │   └── registros/      # Dashboard de métricas
│   └── globals.css         # Estilos globales
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── app-sidebar.tsx     # Navegación lateral
│   └── ChatDrawer.tsx      # Asistente virtual
├── hooks/
│   └── use-mobile.ts       # Hook para detección móvil
└── lib/
    ├── axios-config.ts     # Configuración de Axios
    └── utils.ts            # Utilidades compartidas
```

## 🎯 Funcionalidades Principales

### Gestión de Productos
- ✅ Crear, editar y eliminar productos
- ✅ Categorización automática (CPU, GPU, RAM, etc.)
- ✅ Carga masiva via Excel
- ✅ Gestión de imágenes con drag & drop
- ✅ Control de stock e inventario

### Ensambles de PC
- ✅ Creación de configuraciones completas
- ✅ Selección de componentes del inventario
- ✅ Cálculo automático de precios
- ✅ Gestión de cantidades por componente

### Sistema de Órdenes
- ✅ Procesamiento de pedidos
- ✅ Seguimiento de estados
- ✅ Información detallada del cliente

### Dashboard de Análisis
- ✅ Métricas de ventas por mes
- ✅ Análisis de usuarios y visitas
- ✅ Productos más vendidos
- ✅ Sistema de notificaciones

### Asistente Virtual
- ✅ Chat contextual integrado
- ✅ Ayuda específica por sección
- ✅ Respuestas inteligentes basadas en contenido

## 🔗 API Endpoints

El dashboard se conecta a los siguientes endpoints:

```
GET    /adm/products        # Obtener productos
POST   /adm/products/create # Crear producto
PUT    /adm/products/update/:id # Actualizar producto
DELETE /adm/products/delete/:id # Eliminar producto

GET    /adm/builds          # Obtener ensambles
POST   /adm/builds/create   # Crear ensamble
PUT    /adm/builds/update/:id # Actualizar ensamble
DELETE /adm/builds/delete/:id # Eliminar ensamble
```

## 🎨 Componentes UI

El proyecto utiliza shadcn/ui con los siguientes componentes:

- **Navegación**: Sidebar, Breadcrumb
- **Formularios**: Input, Label, Button
- **Layout**: Card, Separator, Accordion
- **Interacción**: Sheet, Dropdown, Tooltip
- **Feedback**: Toast (Sonner), Badge

## 🚀 Scripts Disponibles

```bash
pnpm dev      # Servidor de desarrollo
pnpm build    # Build para producción
pnpm start    # Servidor de producción
pnpm lint     # Linting con ESLint
```

## 🔧 Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:5000                      # URL del backend
NEXT_PUBLIC_CHATBOT_URL=https://rag.anonymouspc.net/chatbot/chat # URL del asistente virtual
```

### Categorías de Productos

```typescript
const CATEGORY_MAP = {
  1: "PROCESADOR",
  2: "PLACA MADRE", 
  3: "TARJETA GRAFICA",
  4: "MEMORIA RAM",
  5: "ALMACENAMIENTO",
  6: "FUENTE DE PODER",
  7: "CARCASA",
  8: "ACCESORIOS",
  9: "LAPTOPS"
}
```

## 🎯 Próximas Características

- [ ] Autenticación y autorización
- [ ] Sistema de roles y permisos
- [ ] Reportes avanzados en PDF
- [ ] Integración con pasarelas de pago
- [ ] API REST completa documentada
- [ ] Tests unitarios y de integración

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Henry-GC** - [GitHub](https://github.com/Henry-GC)

---

> AnonymousPC Dashboard - Gestión profesional para tu negocio de componentes de PC 🖥️
