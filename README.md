# 🌐 Serakdep MS - Clan de Roblox

**Sitio web oficial del clan Serakdep MS en Roblox** - Una comunidad organizada, respetuosa y divertida para jugadores de todas las edades.

![Clan Logo](images/clan-logo.png)

## 📋 Descripción

Este repositorio contiene el sitio web completo del clan Serakdep MS, una comunidad de Roblox dedicada a crear un espacio seguro y divertido para jugadores. El sitio incluye todas las funcionalidades necesarias para gestionar membresías, eventos, noticias y comunicación con los miembros.

## 🚀 Características del Sitio

### 🏠 **Página de Inicio**
- Logo animado con efectos visuales
- Reproductor de video mejorado con controles completos
- Información esencial sobre el clan
- Botón de solicitud de ingreso

### 📜 **Reglamento**
- Normas generales y específicas del clan
- Sistema de sanciones con tabla de faltas
- Derechos de los miembros
- Confirmación de aceptación

### 📝 **Formulario de Inscripción**
- Proceso completo de admisión
- Campos para información personal y de juego
- Términos y condiciones
- Integración con EmailJS para envío automático

### ❓ **Preguntas Frecuentes (FAQ)**
- Buscador inteligente de preguntas
- 6 categorías organizadas
- Sistema de preguntas desplegables
- Estadísticas de ayuda

### 🎮 **Eventos y Torneos**
- Evento del día con cuenta regresiva
- Sistema de inscripción de equipos (30 equipos)
- Calendario interactivo mensual
- Sistema de rangos y premios

### 📰 **Noticias del Clan**
- Sistema de noticias en tiempo real con **npoint.io**
- Filtros por categoría
- Widget de WhatsApp con estadísticas
- Paginación y noticias destacadas

### 📞 **Contacto**
- Información de contacto principal
- Formularios para reportes, sugerencias, requisitos de aspirantes a admin y formulario de aspirantes de admin
- Equipo administrativo completo

### ⚖️ **Sección Legal**
- Política de Privacidad
- Términos de Servicio
- Política de Cookies
- Aviso DMCA

## 🗂️ Estructura del Proyecto

```
serakdep-ms-website/
│
├── index.html              # Página principal
├── reglamento.html         # Reglamento del clan
├── formulario.html         # Formulario de inscripción
├── faq.html               # Preguntas frecuentes
├── eventos.html           # Eventos y torneos
├── noticias.html          # Sistema de noticias
├── contacto.html          # Página de contacto
├── privacidad.html        # Política de privacidad
├── terminos.html          # Términos de servicio
├── cookies.html           # Política de cookies
├── dmca.html              # Aviso DMCA
│
├── css/                   # Estilos CSS
│   ├── style.css         # Estilos principales
│   ├── responsive.css    # Estilos responsivos
│   ├── eventos.css       # Estilos para eventos
│   ├── noticias.css      # Estilos para noticias
│   └── ...              # Otros estilos
│
├── js/                   # JavaScript
│   ├── main.js          # Funciones principales
│   ├── eventos.js       # Lógica de eventos
│   ├── noticias.js      # Sistema de noticias
│   └── ...             # Otros scripts
│
├── images/               # Imágenes y recursos
├── favicon/              # Iconos del sitio
└── README.md            # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript (ES6+)** - Interactividad
- **Font Awesome 6.4.0** - Iconos
- **npoint.io** - API para noticias (solo lectura)
- **EmailJS** - Envío de formularios

## 📱 Características Técnicas

### ✅ Responsive Design
- Compatible con móviles, tablets y escritorio
- Menú hamburguesa para dispositivos móviles
- Grid y Flexbox para layouts adaptables

### ✅ Accesibilidad
- Etiquetas ARIA para lectores de pantalla
- Contraste de colores adecuado
- Navegación por teclado

### ✅ SEO Optimizado
- Meta etiquetas descriptivas
- URLs amigables
- Estructura de encabezados semántica

### ✅ Performance
- Carga diferida de recursos
- Optimización de imágenes
- Minificación de CSS/JS (recomendado)

## 🔧 Configuración y Uso

### Para Miembros del Clan:
1. Visita Visita https://[(https://github.com/SerakDepMS/Serakdep-MS-Clan/)]
2. Sigue el recorrido recomendado en el guion tutorial
3. Completa el formulario si deseas unirte

### Para Desarrolladores:
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/serakdep-ms-website.git

# Navegar al directorio
cd serakdep-ms-website

# Abrir en tu editor preferido
code .
```

### Personalización:
1. **Configurar npoint.io** para noticias:
   - Crea una cuenta en npoint.io
   - Actualiza la URL en `noticias.html` (línea 59)
   
2. **Configurar EmailJS** para formularios:
   - Crea una cuenta en EmailJS
   - Actualiza las credenciales en `js/form.js`

3. **Cambiar información del clan**:
   - Edita los archivos HTML correspondientes
   - Actualiza enlaces de WhatsApp y contactos

## 📊 Estado del Proyecto

✅ **Completado** - Todas las páginas principales funcionando  
✅ **Testeado** - Compatibilidad con navegadores modernos  
✅ **Documentado** - Guion tutorial y README completos  
🔄 **Mantenimiento** - Actualizaciones periódicas necesarias

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas Importantes

### ⚠️ Requisitos Legales
- Este sitio **NO está afiliado a Roblox Corporation**
- Se debe mantener el aviso de no afiliación en el footer
- Respetar las políticas de uso de marcas registradas

### 🔒 Seguridad
- No almacenar contraseñas en el sitio
- No solicitar información personal sensible
- Usar HTTPS en producción

### 📞 Contacto de Soporte
Para problemas técnicos con el sitio:
- **Email:** serakdepmsofficial7@gmail.com
- **WhatsApp:** +57 311 654 6484
- **Issues:** Usar el sistema de issues de GitHub

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Roblox Corporation** por la plataforma
- **Font Awesome** por los iconos
- **npoint.io** por el servicio de API gratuito
- **EmailJS** por el servicio de correo
- Todos los miembros del clan Serakdep MS

---

**🐼 ¡Únete a nuestra comunidad y vive la mejor experiencia de gaming! 🎮**

*"Unidos por la pasión del gaming"*
