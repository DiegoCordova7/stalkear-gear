# Stalkear Gear - E-Commerce Táctico

> Sistema de despliegue, equipamiento MIL-SPEC y componentes de supervivencia de precisión desarrollado con React y Vite.

---

## Datos del Alumno
* **Nombre:** Diego Emilio Cordova Ciscomani
* **Proyecto:** Stalkear Gear (Tienda en línea de equipamiento táctico)

---

## Tecnologías Utilizadas
* **Frontend:** React (con React Router para la navegación de vistas)
* **Empaquetador y Servidor de Desarrollo:** Vite
* **Estilos:** CSS personalizado con temática táctica oscura.
* **Gestión de Estado y Persistencia:** React Context API + LocalStorage.
* **Multimedia:** Imágenes locales optimizadas (`.webp`) integradas con rutas dinámicas de Vite (`import.meta.env.BASE_URL`).

---

## Instrucciones de Ejecución

Sigue estos pasos para clonar y poner en marcha el proyecto en tu entorno local:

1. **Clonar el repositorio:**
```bash
git clone https://github.com/DiegoCordova7/stalkear-gear
cd stalkear-gear
```

2. **Instalar las dependencias:**

```bash
npm install
```

3. **Ejecutar el servidor de desarrollo:**

```bash
npm run dev
```

4. **Abrir en el navegador:**
Accede a la URL local que proporciona la terminal (por defecto: `http://localhost:5173/stalkear-gear/`).

## Funcionalidades Implementadas
- **Catálogo Dinámico:** Filtrado de productos en tiempo real por categoría y barra de búsqueda predictiva.

- **Detalle de Producto** (`ProductDetail`)**:** Vista ampliada con especificaciones técnicas detalladas (`MIL-SPEC`), selector de cantidades y control de stock en tiempo real.

- **Gestión de Carrito y Checkout:** Añadir/quitar artículos, cálculo automático del total general y generación de órdenes de compra con persistencia local.

- **Centro de Mando (Panel de Administración):**

    - Alta de nuevos productos directamente en el inventario.
    - Modificación rápida de stock disponible.
    - Historial global de transacciones/órdenes de la red.
    - Visualización de operadores registrados.

- **Sistema de Autenticación y Roles:** Control de acceso diferenciado entre clientes y administradores.

## Credenciales de Demostración del Administrador
Para acceder al **Centro de Mando y Administración** y probar los privilegios de alto rango, puedes utilizar las siguientes credenciales preconfiguradas:

- **Correo electrónico:** `admin@stalkear.com`

- **Contraseña:** `admin`

- **Rol / Rango:** `admin`