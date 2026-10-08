/* ============================================================
   DATOS DEL SITIO - Proyectos Finales CENT 35
   Para agregar un proyecto: copiar un bloque de PROYECTOS y
   completar los campos. "carrera" debe coincidir con un "slug"
   de CARRERAS. Las imágenes van en la carpeta img/ (JPG, PNG, SVG).
   ============================================================ */

const CARRERAS = [
  { slug: "mantenimiento-industrial", codigo: "MI",  nombre: "Técnico Superior en Mantenimiento Industrial con orientación en Seguridad e Higiene en el Trabajo", corto: "Mantenimiento Industrial" },
  { slug: "administracion-empresas-up", codigo: "AE", nombre: "Técnico Superior de Administración de Empresas - UP", corto: "Administración de Empresas - UP" },
  { slug: "automatizacion-robotica", codigo: "AR", nombre: "Técnico Superior en Automatización y Robótica", corto: "Automatización y Robótica" },
  { slug: "procesos-quimicos", codigo: "PQ", nombre: "Técnico Superior en Industrias de Procesos Químicos", corto: "Procesos Químicos" },
  { slug: "diseno-grafico", codigo: "DG", nombre: "Diseño Gráfico", corto: "Diseño Gráfico" },
  { slug: "enfermeria", codigo: "EN", nombre: "Técnico Superior en Enfermería", corto: "Enfermería" },
  { slug: "desarrollo-de-software", codigo: "DS", nombre: "Técnico Superior en Desarrollo de Software", corto: "Desarrollo de Software" },
  { slug: "petroleo", codigo: "PE", nombre: "Técnico Superior en Petróleo", corto: "Petróleo" },
  { slug: "administracion-publica", codigo: "AP", nombre: "Técnico Superior en Administración Pública con orientación en Desarrollo Local", corto: "Administración Pública" },
  { slug: "comunicacion-social", codigo: "CS", nombre: "Técnico Superior en Comunicación Social", corto: "Comunicación Social" },
  { slug: "comunicacion-social-up1", codigo: "C1", nombre: "Técnico Superior en Comunicación Social - UP1", corto: "Comunicación Social - UP1" },
  { slug: "transporte-logistica", codigo: "TL", nombre: "Técnico Superior en Transporte y Logística", corto: "Transporte y Logística" },
  { slug: "gestion-ambiental", codigo: "GA", nombre: "Técnico Superior en Gestión Ambiental con orientación Forestal", corto: "Gestión Ambiental" },
  { slug: "turismo-ecoturismo", codigo: "TE", nombre: "Técnico Superior en Turismo con orientación en Ecoturismo", corto: "Turismo - Ecoturismo" },
  { slug: "administracion-empresas", codigo: "EM", nombre: "Técnico Superior en Administración de Empresas", corto: "Administración de Empresas" },
  { slug: "acompanamiento-terapeutico", codigo: "AT", nombre: "Técnico Superior en Acompañamiento Terapéutico", corto: "Acompañamiento Terapéutico" }
];

/* NOTA: los proyectos siguientes son DATOS DE PRUEBA (alumnos y proyectos ficticios). */
const PROYECTOS = [
  {
    id: "turnero-salud",
    carrera: "desarrollo-de-software",
    titulo: "Turnero de Salud",
    alumnos: ["Lucía Fernández", "Matías Ojeda"],
    anio: 2025,
    destacado: true,
    tecnologias: ["PHP", "MySQL", "Bootstrap", "JavaScript"],
    resumen: "Sistema web para que los pacientes soliciten turnos en centros de atención primaria y el personal administrativo gestione agendas, profesionales y recordatorios.",
    descripcion: "El proyecto surge de la demora en la asignación de turnos telefónicos en un centro de salud barrial. Permite registrar profesionales y especialidades, definir agendas semanales, reservar y cancelar turnos desde el celular y enviar recordatorios por correo electrónico. Incluye un panel con estadísticas de ausentismo y un módulo de roles (administrador, recepción, profesional).",
    objetivos: ["Reducir el ausentismo mediante recordatorios automáticos", "Centralizar las agendas de todos los profesionales", "Ofrecer una interfaz simple para adultos mayores"],
    imagenes: ["img/turnero-1.svg", "img/turnero-2.svg", "img/turnero-3.svg"],
    docente: "Prof. Alfredo (Programación II)",
    enlaces: []
  },
  {
    id: "recicla-tdf",
    carrera: "desarrollo-de-software",
    titulo: "Reciclá TDF",
    alumnos: ["Camila Ruiz", "Joaquín Paredes", "Sofía Villarroel"],
    anio: 2025,
    destacado: true,
    tecnologias: ["Flutter", "Firebase", "Google Maps API"],
    resumen: "Aplicación móvil que localiza puntos limpios y muestra los días de recolección diferenciada en Río Grande, con avisos y una guía de qué residuo va en cada contenedor.",
    descripcion: "Reciclá TDF reúne en un mapa los puntos de acopio de la ciudad, informa horarios y materiales aceptados, y permite a los vecinos reportar contenedores llenos. Un módulo educativo explica cómo separar residuos y suma puntos por cada reporte validado. Los datos se sincronizan en tiempo real mediante Firebase.",
    objetivos: ["Facilitar el acceso a los puntos limpios", "Promover la separación en origen", "Generar datos abiertos para el municipio"],
    imagenes: ["img/recicla-1.svg", "img/recicla-2.svg", "img/recicla-3.svg"],
    docente: "Prof. Alfredo (Informática y Programación)",
    enlaces: []
  },
  {
    id: "stock-ferretero",
    carrera: "desarrollo-de-software",
    titulo: "Stock Ferretero",
    alumnos: ["Nicolás Barrientos"],
    anio: 2024,
    destacado: true,
    tecnologias: ["C#", ".NET 8", "WinForms", "SQL Server"],
    resumen: "Aplicación de escritorio para controlar inventario, proveedores y ventas de mostrador de una ferretería, con alertas de stock mínimo y reportes de rentabilidad.",
    descripcion: "Desarrollado a pedido de un comercio real de la ciudad. Reemplaza planillas de cálculo por un sistema con códigos de barras, listas de precios por proveedor, remitos y cierre de caja diario. Incluye importación de listas en Excel y emisión de reportes en PDF.",
    objetivos: ["Eliminar la carga manual en planillas", "Alertar sobre faltantes antes de que ocurran", "Reportar rentabilidad por rubro"],
    imagenes: ["img/stock-1.svg", "img/stock-2.svg", "img/stock-3.svg"],
    docente: "Prof. Alfredo (Programación II)",
    enlaces: []
  },
  {
    id: "refugios-del-sur",
    carrera: "desarrollo-de-software",
    titulo: "Refugios del Sur",
    alumnos: ["Valentina Cárdenas", "Federico Alvarado"],
    anio: 2025,
    destacado: true,
    tecnologias: ["React", "Node.js", "MongoDB", "Leaflet"],
    resumen: "Plataforma de reservas para refugios y senderos de Tierra del Fuego, con mapa interactivo, disponibilidad en tiempo real y estado de las rutas.",
    descripcion: "Pensada para turistas y guías de montaña. Cada refugio administra sus plazas y precios; los visitantes buscan sobre el mapa, reservan y reciben la confirmación con indicaciones del sendero. Un panel para guardaparques permite informar el estado de los caminos y alertas meteorológicas.",
    objetivos: ["Ordenar la ocupación de refugios en temporada alta", "Mejorar la seguridad con información de rutas", "Dar visibilidad al turismo de naturaleza local"],
    imagenes: ["img/refugios-1.svg", "img/refugios-2.svg", "img/refugios-3.svg"],
    docente: "Prof. Alfredo (Informática y Programación)",
    enlaces: []
  },
  {
    id: "biblioteca-escolar",
    carrera: "desarrollo-de-software",
    titulo: "Biblioteca Escolar",
    alumnos: ["Agustina Molina", "Tomás Gallardo"],
    anio: 2024,
    destacado: false,
    tecnologias: ["Java", "Spring Boot", "PostgreSQL", "Thymeleaf"],
    resumen: "Sistema de préstamos y catálogo para bibliotecas escolares, con carnet de socios, vencimientos y búsqueda por título, autor o materia.",
    descripcion: "Permite catalogar ejemplares, registrar socios y controlar préstamos y devoluciones con avisos de vencimiento. Incluye búsqueda avanzada, estadísticas de lectura por curso y exportación del inventario para auditorías.",
    objetivos: ["Digitalizar el catálogo de la biblioteca", "Controlar préstamos y morosidad", "Conocer los hábitos de lectura por curso"],
    imagenes: ["img/biblio-1.svg", "img/biblio-2.svg", "img/biblio-3.svg"],
    docente: "Prof. Alfredo (Programación II)",
    enlaces: []
  },
  {
    id: "estacion-meteo",
    carrera: "desarrollo-de-software",
    titulo: "Estación Meteo IoT",
    alumnos: ["Ezequiel Montenegro", "Brisa Cabrera"],
    anio: 2025,
    destacado: false,
    tecnologias: ["ESP32", "MQTT", "Python", "Chart.js"],
    resumen: "Estación meteorológica con sensores de temperatura, humedad, presión y viento que publica los datos en un dashboard web en tiempo real.",
    descripcion: "Un microcontrolador ESP32 recoge las mediciones y las envía por MQTT a un servidor en Python que las almacena y las expone mediante una API. El dashboard muestra gráficos históricos, alertas por viento fuerte y permite descargar los datos en CSV.",
    objetivos: ["Medir el clima local con bajo costo", "Practicar integración hardware–software", "Publicar datos abiertos para la comunidad"],
    imagenes: ["img/estacion-1.svg", "img/estacion-2.svg", "img/estacion-3.svg"],
    docente: "Prof. Alfredo (Sistemas Operativos)",
    enlaces: []
  }
];

/* ============================================================
   CARRUSEL DE LA PORTADA
   Para usar fotos reales del CENT 35: copiarlas a img/carrusel/
   (JPG o PNG, ideal 1920x800 px) y listarlas acá. Se muestran en
   orden y se reemplazan las imágenes ilustradas de ejemplo.
   ============================================================ */
const CARRUSEL = [
  { src: "img/carrusel/1-cordillera.svg", titulo: "CENT 35 · Río Grande", texto: "Tierra del Fuego, el fin del mundo" },
  { src: "img/carrusel/2-costa.svg",      titulo: "Formación técnica superior", texto: "Carreras con salida laboral en la provincia" },
  { src: "img/carrusel/3-bosque.svg",     titulo: "Proyectos con identidad fueguina", texto: "Tecnología aplicada a problemas locales" },
  { src: "img/carrusel/4-noche.svg",      titulo: "Más de 30 años formando técnicos", texto: "Desde 1988 en Río Grande" }
];
