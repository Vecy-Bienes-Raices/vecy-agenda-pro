# Vecy Agenda Pro

**Vecy Agenda Pro** es una aplicación web de formularios diseñada para optimizar y asegurar el proceso de solicitud de servicios en Vecy Bienes Raíces. Permite tanto a clientes directos como a agentes inmobiliarios enviar solicitudes de manera digital, generando automáticamente contratos de colaboración en PDF para los agentes.

## ✨ Características Principales

- **Formulario Dinámico**: Los campos se adaptan según el perfil del usuario (Cliente o Agente).
- **Generación de PDF**: Crea contratos de colaboración ("puntas") en tiempo real para los agentes.
- **Notificaciones por Correo**: Envía confirmaciones personalizadas y contratos adjuntos utilizando SendGrid.
- **Firma Digital y Virtual**: Permite a los agentes firmar dibujando en pantalla o subiendo un archivo de firma.
- **Validación Robusta**: Asegura que todos los datos necesarios sean correctos antes del envío.
- **Interfaz Moderna**: Construida con Tailwind CSS para un diseño limpio y responsivo.

## 🛠️ Stack Tecnológico

- **Frontend**: React con Vite
- **Estilos**: Tailwind CSS
- **Backend y Base de Datos**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Envío de Correos**: SendGrid
- **Generación de PDF**: `pdf-lib` dentro de una Edge Function de Deno.

## 🚀 Cómo Empezar

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/vecy-agenda-pro.git
    cd vecy-agenda-pro
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus claves de Supabase.

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.
