# 🏎️ F1 React Application

Una aplicación web moderna de Formula 1 construida con Next.js, React, TypeScript y Ant Design.

## ✨ Características

- **🏁 Equipos de F1**: Visualización completa de equipos con información detallada
- **👨‍💼 Búsqueda de Pilotos**: Búsqueda por nombre o año con validación inteligente
- **📊 Gráficos Interactivos**: Visualización de campeonatos de pilotos y constructores
- **🎨 UI Moderna**: Interfaz atractiva y responsiva con Ant Design
- **🔍 Navegación Intuitiva**: Sidebar con navegación fácil entre secciones
- **⚡ Rendimiento Optimizado**: Debouncing, validación de inputs y manejo de errores

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI**: Ant Design, Tailwind CSS
- **Gráficos**: Recharts
- **API**: F1 API (f1api.dev)
- **Linting**: ESLint con configuración personalizada

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/f1-react-app.git
   cd f1-react-app
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador:**
   ```
   http://localhost:3000
   ```

## 📱 Funcionalidades

### 🏁 Página de Equipos
- Lista completa de equipos de F1
- Información detallada: nacionalidad, campeonatos, primera aparición
- Enlaces a pilotos de cada equipo
- Diseño responsivo con cards atractivas

### 👨‍💼 Búsqueda de Pilotos
- **Búsqueda por nombre**: Mínimo 4 caracteres con debouncing
- **Búsqueda por año**: Validación de rango 1950-2024
- **Validación inteligente**: Previene errores de entrada
- **Resultados en tiempo real**: Actualización automática

### 📊 Gráficos de Campeonatos
- **Top 5 Pilotos**: Gráfico de barras por año
- **Top 5 Constructores**: Gráfico de barras por año
- **Interactividad**: Tooltips y leyendas informativas
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### 🧭 Navegación
- **Sidebar fijo**: Navegación fácil entre secciones
- **Diseño responsivo**: Se adapta a móviles y desktop
- **Iconos intuitivos**: Fácil identificación de secciones

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de linting automáticamente
```

## 🎯 Mejoras Implementadas

### ✅ Manejo de Errores
- Validación robusta de inputs
- Manejo de errores de API
- Mensajes de error informativos
- Prevención de búsquedas simultáneas

### ✅ Optimización de Rendimiento
- Debouncing en búsquedas (500ms)
- Lazy loading de componentes
- Optimización de re-renders
- Caching de respuestas de API

### ✅ Experiencia de Usuario
- Loading states informativos
- Validación en tiempo real
- Feedback visual inmediato
- Diseño responsivo completo

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (dashboard)/          # Rutas del dashboard
│   │   ├── components/       # Componentes reutilizables
│   │   ├── teams/           # Página de equipos
│   │   ├── drivers/         # Página de pilotos
│   │   ├── charts/          # Página de gráficos
│   │   └── layout.tsx       # Layout del dashboard
│   ├── api/                 # API routes
│   ├── globals.css          # Estilos globales
│   └── layout.tsx           # Layout principal
```

## 🌐 API Externa

La aplicación consume datos de [F1 API](https://f1api.dev/):
- `/api/current/teams` - Equipos actuales
- `/api/drivers/search` - Búsqueda de pilotos
- `/api/{year}/drivers` - Pilotos por año
- `/api/{year}/drivers-championship` - Campeonato de pilotos
- `/api/{year}/constructors-championship` - Campeonato de constructores

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad de Formula 1.

---

**¡Disfruta explorando los datos de Formula 1! 🏎️🏁**